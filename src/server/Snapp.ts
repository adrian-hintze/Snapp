/**
 * Snapp.ts
 *
 * Created on: 2016-09-27
 *     Author: Adrian Hintze @Rydion
 *
 */

'use strict';

global.rootDir = __dirname;

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import * as mime from 'mime';
import * as compression from 'compression';

import generateExecutable from './GenerateExecutableHandler';

import * as fileSystemUtils from './utils/FileSystem';

import logModule from './log/Log';


global.conf = require(path.join(global.rootDir, '..', 'snapp_conf.json'));


const log = logModule({  });
const moduleName = path.basename(__filename);
const defaultPort = 80;
const port = global.conf.port || defaultPort;
const uploadFolder = path.join(__dirname, '..', 'upload', 'projects');
const defaultFileSizeLimit = 10000000; // 10 MB
const fileSizeLimit = global.conf.uploadFileSizeLimit || defaultFileSizeLimit; // bytes


const limits = { fileSize: fileSizeLimit }; // Workaround for an error in @Types/multer
const upload = multer({
    limits,
    storage: multer.diskStorage({
        destination: uploadFolder,
        filename(request, file, callback) {
            const currentDate = new Date().toISOString().split(':').join('');
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
    snapProjectUpload(request, response, (error: null | any) => {
        if (error) {
            log.error({ moduleName, message: 'Error ocurred while uploading project xml.', meta: { error } });
            const { code = '' } = error;
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

snapp

.use(compression())
.use(bodyParser.json())

.use('/', express.static(path.join(global.rootDir, '..', 'WebContent')))

.get('/', (request: express.Request, response: express.Response) => response.sendFile(path.join(global.rootDir, '..', 'WebContent', 'snapp.html')))

.post('/gen-exec', snapProjectUploadMiddleware, (request: express.Request, response: express.Response) => {
    if (!request.file) {
        response.status(400).json({ code: 'FILE_MISSING' });
        return;
    }

    const { path: projectPath, originalname } = request.file;
    const extname = path.extname(originalname);
    const filename = path.basename(originalname, extname);
    const body = request.body;
    body.filename = filename;
    body.useCompleteSnap = (typeof body.useCompleteSnap === 'string') ? body.useCompleteSnap === 'true' : !!body.useCompleteSnap;

    generateExecutable(projectPath, body)
    .then((zip: NodeJS.ReadableStream) => {
        const attachmentFilename = `${filename}.zip`;
        const mimeType = mime.lookup(attachmentFilename);

        response.setHeader('Content-disposition', `attachment; filename=${attachmentFilename}`);
        response.setHeader('Content-type', mimeType);

        zip.pipe(response);
    })
    .catch((error: NodeJS.ErrnoException | Error | any) => {
        log.error({ moduleName, message: 'Error ocurred while generating executable.', meta: { error } });
        const { code } = error;
        response.status(error.status || 500).json({ code });
    })
    .then(() => fileSystemUtils.rmDir(projectPath))
    .catch(error => log.error({ moduleName, message: 'Unable to delete the project file.', meta: { projectPath, error } }));
})

.listen(port, () => log.info({ moduleName, message: `Snapp listening on port ${port}.` })); 
