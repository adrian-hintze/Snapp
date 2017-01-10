/*
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

import generateExecutable from './GenerateExecutableHandler';

import * as fileSystemUtils from './utils/FileSystem';

import logModule from './log/Log';

global.conf = require(path.join(global.rootDir, '..', 'snapp_conf.json'));

const log = logModule({  });

const moduleName = path.basename(__filename);
const defaultPort = 80;
const port = global.conf.port || defaultPort;
const fileSize = global.conf.uploadFileSizeLimit || 10000000; // bytes

const uploadFolder = path.join(__dirname, '..', 'upload', 'projects');
const storage = multer.diskStorage({
    destination: uploadFolder,
    filename (request, file, cb) {
        const currentDate = new Date().toISOString().split(':').join('');
        cb(null, `${currentDate} - ${file.originalname}`);
    }
});
const limits = { fileSize };
const upload = multer({ storage, limits });
const snapProjectUpload = upload.single('project');
const snapProjectUploadMiddleware = function (request: any, response: any, next: Function) {
    snapProjectUpload(request, response, (error: null | any) => {
        if (error) {
            log.error({ moduleName, message: 'Error ocurred while uploading project xml.', meta: { error } });
            if (error.code === 'LIMIT_FILE_SIZE') {
                response.status(413).end();
            }
            else {
                response.status(500).end();
            }
            return;
        }
        next();
    });
}


express()

.use(bodyParser.json({ limit: '100mb' }))

.use('/', express.static(path.join(global.rootDir, '..', 'WebContent')))

.get('/', (request, response) => response.sendFile(path.join(global.rootDir, '..', 'WebContent', 'snapp.html')))

.post('/gen-exec', snapProjectUploadMiddleware, (request, response) => {
    if (!request.file) {
        response.status(400).end();
        return;
    }

    const { path: projectPath, originalname } = request.file;

    const extname = path.extname(originalname);
    if (extname !== '.xml') {
        response.status(400).end();
        return;
    }

    const params = request.body;
    const filename = path.basename(originalname, extname);
    params.filename = filename;
    params.useCompleteSnap = params.useCompleteSnap === 'true';

    generateExecutable(projectPath, params)
    .then((zip: NodeJS.ReadableStream) => {
        const attachmentFilename = `${filename}.zip`;
        const mimeType = mime.lookup(attachmentFilename);

        response.setHeader('Content-disposition', `attachment; filename=${attachmentFilename}`);
        response.setHeader('Content-type', mimeType);

        zip.pipe(response);
    })
    .catch((error: NodeJS.ErrnoException | Error | any) => {
        log.error({ moduleName, message: 'Error ocurred while generating executable.', meta: { error: error.error || error } });
        response.status(error.status || 500).end();
    })
    .then(() => {
        fileSystemUtils.rmDir(projectPath);
    })
    .catch(error => log.error({ moduleName, message: 'Unable to delete the project file.', meta: { projectPath, error } }));
})

.listen(port, () => log.info({ moduleName, message: `Snapp listening on port ${port}` })); 
