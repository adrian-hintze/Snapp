/**
 * Snapp.ts
 *
 * Created on: 2016-09-27
 *     Author: Adrian Hintze @Rydion
 *
 */

global.rootDir = __dirname;

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import * as mime from 'mime';
import * as compression from 'compression';

import generateExecutable from './GenerateExecutableHandler';

import * as fileSystemUtils from './utils/FileSystem';

import { logger } from './log/Log';


global.conf = require(path.join(global.rootDir, '..', 'snapp_conf.json'));


const moduleName: string = path.basename(__filename);
const defaultPort: number = 80;
const port: number = global.conf.port || defaultPort;
const uploadFolder: string = path.join(__dirname, '..', 'upload', 'projects');
const defaultFileSizeLimit: number = 10000000; // bytes - 10 MB
const fileSizeLimit: number = global.conf.uploadFileSizeLimit || defaultFileSizeLimit; // bytes
const compressStaticFilesDefault: boolean = true;
const compressStaticFiles: boolean = typeof global.conf.compressStaticFiles === 'boolean' ? global.conf.compressStaticFiles : compressStaticFilesDefault;


const upload = multer({
    limits: {
        fileSize: fileSizeLimit
    },
    storage: multer.diskStorage({
        destination: uploadFolder,
        filename(request, file, callback) {
            const currentDate = new Date().toISOString().split(':').join(''); // TODO -low- Move to some Utils file
            callback(null, `${currentDate} - ${file.originalname}`);
        }
    }),
    fileFilter(request, file, callback) {
        const allowedExtension = '.xml';
        const fileExtension = path.extname(file.originalname);

        if (fileExtension !== allowedExtension) {
            const error: any = new Error(`Unallowed file extension ${fileExtension}.`);
            error.code = 'REJECTED_FILE_EXTENSION';
            return callback(error, false);
        }

        const error: any = null; // Workaround for an error in @Types/multer
        callback(error, true);
    }
});

const snapProjectUpload = upload.single('project');
const snapProjectUploadMiddleware = function (request: express.Request, response: express.Response, next: express.NextFunction) {
    snapProjectUpload(request, response, (error) => {
        if (error) {
            logger.error({ moduleName, message: 'Error ocurred while uploading project xml.', error });
            const { code } = error;
            switch (error.code) {
                case 'LIMIT_FILE_SIZE':             response.status(413).json({ code, fileSizeLimit }); break;
                case 'REJECTED_FILE_EXTENSION':     response.status(400).json({ code }); break;
                default:                            response.status(500).json({ code });
            }
            return;
        }

        next();
    });
}

const snapp = express();

if (compressStaticFiles) {
    snapp.use(compression());
}

snapp

.use(bodyParser.json({ limit: `${fileSizeLimit/1000000}mb` }))
.use(bodyParser.urlencoded({
    limit: `${fileSizeLimit/1000000}mb`,
    extended: true,
    parameterLimit: 50000
}))

.use('/', express.static(path.join(global.rootDir, '..', 'WebContent')))

.get('/', (request: express.Request, response: express.Response) => response.sendFile(path.join(global.rootDir, '..', 'WebContent', 'snapp.html')))

.post('/gen-exec', snapProjectUploadMiddleware, (request: express.Request, response: express.Response) => {
    if (!request.file) {
        response.status(400).json({ code: 'FILE_MISSING' });
        return;
    }

    const { path: projectPath, originalname } = request.file;
    const extname: string = path.extname(originalname);
    const filename: string = path.basename(originalname, extname);
    const body: any = request.body;
    body.filename = filename;
    body.useCompleteSnap = (typeof body.useCompleteSnap === 'string') ? body.useCompleteSnap === 'true' : !!body.useCompleteSnap;

    generateExecutable(projectPath, body)
    .then((zip) => {
        const attachmentFilename = `${filename}.zip`;
        const mimeType: string = <string>mime.getType(attachmentFilename);

        response.setHeader('Content-disposition', `attachment; filename=${attachmentFilename}`);
        response.setHeader('Content-type', mimeType);

        zip.pipe(response);
    })
    .catch((error: NodeJS.ErrnoException | any) => {
        logger.error({ moduleName, message: 'Error ocurred while generating executable.', error });
        const { code } = error;
        response.status(error.status || 500).json({ code });
    })
    .then(() => fileSystemUtils.rmDir(projectPath))
    .catch(error => logger.error({ moduleName, message: 'Unable to delete the project file.', error, meta: { projectPath } }));
})

.listen(port, () => logger.info({ moduleName, message: `Snapp listening on port ${port}.` })); 
