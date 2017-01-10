/**
 * GenerateExecutableHandler.ts
 *
 * Created on: 2016-09-25
 *     Author: Adrian Hintze @Rydion
 *
 */

'use strict';

import * as path from 'path';

import streamToArray = require('stream-to-array');

import Xml from './Xml';
import Zip from './Zip';

import * as fileSystemUtils from './utils/FileSystem';
import * as validationUtils from './utils/Validation';

import logModule from './log/Log';

const moduleName = path.basename(__filename);
const log = logModule();
const resourcesDir = path.join(global.rootDir, '..', 'resources');
const unixExecutablePermissions = 0o0755;
const macToolbarCode =
`
var gui = require('nw.gui');
var win = gui.Window.get();
var menu = new gui.Menu({ type: 'menubar' });
menu.createMacBuiltin('<project_name>', {
    hideEdit: true,
    hideWindow: true
});
win.menu = menu;
var close = {
    key: 'Ctrl+q',
    active: function () { win.close(); }
};
var closeWindow = {
    key: 'Ctrl+w',
    active: function () { win.close(); }
};
var minimize = {
    key: 'Ctrl+m',
    active: function () { win.minimize(); }
};
var closeShortcut = new gui.Shortcut(close);
var closeWindowShortcut = new gui.Shortcut(closeWindow);
var minimizeShortcut = new gui.Shortcut(minimize);
gui.App.registerGlobalHotKey(closeShortcut);
gui.App.registerGlobalHotKey(closeWindowShortcut);
gui.App.registerGlobalHotKey(minimizeShortcut);
win.on('focus', function () {
    gui.App.registerGlobalHotKey(closeShortcut);
    gui.App.registerGlobalHotKey(closeWindowShortcut);
    gui.App.registerGlobalHotKey(minimizeShortcut);
});
win.on('blur', function () {
    gui.App.unregisterGlobalHotKey(closeShortcut);
    gui.App.unregisterGlobalHotKey(closeWindowShortcut);
    gui.App.unregisterGlobalHotKey(minimizeShortcut);
});
`;

interface ErrorFeedback {
    message: string;
}

function validateFilename(filename: string): ErrorFeedback | undefined {
    if (validationUtils.validateString(filename, false)) {
        return { message: 'validateFilename1' };
    }
}

function validateFileContents(fileContents: string): ErrorFeedback | undefined {
    if (validationUtils.validateString(fileContents, false)) {
        return { message: 'validateFileContents1' };
    }
    
    if (!Xml.isValidString(fileContents)) {
        return { message: 'validateFileContents2' };
    }

    const xml = Xml.fromString(fileContents);
    if (!xml.hasProperty('name')) {
        return { message: 'validateFileContents3' };
    }
    if (!xml.getProperty('name')) {
        return { message: 'validateFileContents4' };
    }
}

function validateOs(os: string): ErrorFeedback | undefined {
    const validOsValues = ['mac32', 'mac64', 'lin32', 'lin64', 'win32', 'win64'];
    if (validationUtils.validateString(os, false, validOsValues)) {
        return { message: 'validateOs1' };
    }
}

class Resolution {
    static fromString(resolution: string) {
        if (resolution.indexOf('x') < 0) {
            throw new Error('');
        }
        const dimensions = resolution.split('x');
        if (dimensions.length !== 2) {
            throw new Error('');
        }
        if (isNaN(Number(dimensions[0])) || isNaN(Number(dimensions[1]))) {
            throw new Error('');
        }

        return new Resolution(parseInt(dimensions[0]), parseInt(dimensions[1]));
    }

    public width: number;
    public height: number;

    private constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
};

function validateResolution(resolution: string): ErrorFeedback | undefined {
    if (validationUtils.validateString(resolution, false)) {
        return { message: 'validateResolution1' };
    }

    try {
        Resolution.fromString(resolution);
    }
    catch (error) {
        return { message: 'validateResolution2' };
    }
}

function validateUseCompleteSnap(useCompleteSnap: boolean): ErrorFeedback | undefined {
    if (validationUtils.validateBoolean(useCompleteSnap)) {
        return { message: 'validateUseCompleteSnap1' };
    }
}

interface ExecGenerationRequestParams {
    filename: string;
    project: string;
    os: string;
    resolution: string;
    useCompleteSnap: boolean;
}

function validateParams({ filename, project, os, resolution, useCompleteSnap }: ExecGenerationRequestParams): ErrorFeedback | undefined {
    return validateFilename(filename) ||
           validateFileContents(project) ||
           validateOs(os) ||
           validateResolution(resolution) ||
           validateUseCompleteSnap(useCompleteSnap);
}

function getProjectName(fileContents: string): string {
    return Xml.fromString(fileContents).getProperty('name');
}

function buildPackageJson(os: string, projectName: string, resolution: Resolution): string {
    return JSON.stringify({
        name: 'snapapp',
        main: 'snap.html',
        nodejs: os === 'mac32' || os === 'mac64',
        'single-instance': true,
        window: {
            icon: 'lambda.png',
            title: projectName,
            toolbar: false,
            resizable: true,
            width: resolution.width,
            height: resolution.height
        }
    });
}

function buildGui(gui: string, project: string, os: string, projectName: string) {
    let result = gui + '\n';
    if (os === 'mac32' || os === 'mac64') {
        result += macToolbarCode.replace('<project_name>', projectName) + '\n';
    }
    return result + `IDE_Morph.prototype.snapproject = '${project}';`
}

function buildProjectPackage(projectPackage: Zip, project: string, os: string, projectName: string, resolution: Resolution, useCompleteSnap: boolean): Promise<Error | void> {
    const version = useCompleteSnap ? 'full' : 'reduced';

    projectPackage.append(buildPackageJson(os, projectName, resolution), { name: 'package.json' });
    projectPackage.directory(path.join(resourcesDir, 'snap', version, 'files'), '');

    return fileSystemUtils.readTextFile(path.join(resourcesDir, 'snap', version, 'gui', 'gui.js'))
           .then((gui: string) => {
               projectPackage.append(buildGui(gui, project, os, projectName), { name: 'gui.js' });
               return;
           })
           .catch((error: NodeJS.ErrnoException) => {
               log.error({ moduleName, message: 'Unable to read gui file.', meta: { version: version, errorCode: error.code } });
               throw error;
           });
}

function buildFinalPackage(finalPackage: Zip, os: string, projectName: string, filename: string): Promise<Error | void> {
    switch (os) {
        case 'mac64':
        case 'mac32': {
            const rootDir = projectName + '.app';

            finalPackage.directory(path.join(resourcesDir, 'nw', os, 'Contents'), path.join(rootDir, 'Contents'));
            finalPackage.file(path.join(resourcesDir, 'nw', os, 'bin', 'nwjs'), { name: path.join(rootDir, 'Contents', 'MacOS', 'nwjs'), mode: unixExecutablePermissions });
            finalPackage.file(path.join(resourcesDir, 'icons', 'lambda.icns'), { name: path.join(rootDir, 'Contents', 'Resources', 'nw.icns') });

            return fileSystemUtils.readTextFile(path.join(resourcesDir, 'conf', os, 'Info.plist'))
            .then((plist: string) => {
                plist = plist.replace('<filename>', filename).replace('<short_filename>', filename.length < 16 ? filename : 'Snapp!');
                finalPackage.append(plist, { name: path.join(rootDir, 'Contents', 'Info.plist') });
                return;
            })
            .catch((error: NodeJS.ErrnoException) => {
                log.error({ moduleName, message: 'Unable to read mac Info.plist.', meta: { os } });
                throw error;
            });
        }
        case 'lin64':
        case 'lin32': {
            const rootDir = projectName + '.snapp';

            finalPackage.directory(path.join(resourcesDir, 'nw', os, 'lib'), rootDir);
            finalPackage.file(path.join(resourcesDir, 'icons', 'lambda.png'), { name: path.join(rootDir, 'lambda.png') });

            const readFilesPromises: Array<Promise<Error | void>> = [
                fileSystemUtils.readTextFile(path.join(resourcesDir, 'conf', 'linux', 'launcher.sh'))
                .then((launcher: string) => {
                    launcher = launcher.replace('<filename>', filename);
                    finalPackage.append(launcher, { name: path.join(rootDir, 'launcher.sh'), mode: unixExecutablePermissions });
                    return;
                })
                .catch((error: NodeJS.ErrnoException) => {
                    log.error({ moduleName, message: 'Unable to read linux launcher.sh.', meta: { os } });
                    throw error;
                }),
                fileSystemUtils.readTextFile(path.join(resourcesDir, 'conf', 'linux', 'app.desktop'))
                .then((launcher: string) => {
                    launcher = launcher.replace('<filename>', filename);
                    finalPackage.append(launcher, { name: filename + '.desktop', mode: unixExecutablePermissions });
                })
                .catch((error: NodeJS.ErrnoException) => {
                    log.error({ moduleName, message: 'Unable to read linux app.desktop.', meta: { os } });
                })
            ];

            return Promise.all(readFilesPromises).then(() => { return; }).catch(error => { throw error; });
        }
        case 'win64':
        case 'win32':
            finalPackage.directory(path.join(resourcesDir, 'nw', os, 'dll'), filename);
            return Promise.resolve();
        default:
            log.error({ moduleName, message: 'Invalid os.', meta: { os } });
            return Promise.reject(new Error('Invalid os.'));
    }
}

function buildPackages(params: ExecGenerationRequestParams): Promise<Error | NodeJS.ReadableStream> {
    return new Promise<Error | NodeJS.ReadableStream>((resolve, reject) => {
        const { project, os, resolution: res, useCompleteSnap, filename } = params;
        const projectName = getProjectName(project);
        const resolution = Resolution.fromString(res);

        const finalPackage: Zip = new Zip((error: any) => reject(error), () => log.info({ moduleName, message: 'Final package finished.' }));

        const nwPackage: Zip = new Zip((error: any) => reject(error), () => {
            streamToArray(nwPackage.getStream())
            .then((parts: Array<Buffer>) => {
                const buffer = Buffer.concat(parts);
                switch (os) {
                    case 'mac64':
                    case 'mac32':
                        finalPackage
                        .append(buffer, { name: path.join(projectName + '.app', 'Contents', 'Resources', 'app.nw'), mode: unixExecutablePermissions })
                        .finalize();
                        break;
                    case 'lin64':
                    case 'lin32':
                        fileSystemUtils.readFile(path.join(resourcesDir, 'nw', os, 'bin', 'nw'))
                        .then((file: Buffer) => {
                            finalPackage
                            .append(Buffer.concat([file, buffer]), { name: path.join(projectName + '.snapp', filename), mode: unixExecutablePermissions })
                            .finalize();
                            return;
                        })
                        .catch((error: NodeJS.ErrnoException) => reject(error));
                        break;
                    case 'win64':
                    case 'win32':
                        fileSystemUtils.readFile(path.join(resourcesDir, 'nw', os, 'exe', 'nw.exe'))
                        .then((file: Buffer) => {
                            finalPackage
                            .append(Buffer.concat([file, buffer]), { name: path.join(filename, filename + '.exe') })
                            .finalize();
                            return;
                        })
                        .catch((error: NodeJS.ErrnoException) => reject(error));
                        break;
                    default:
                        log.error({ moduleName, message: 'Invalid os.', meta: { os } });
                        reject(new Error('Invalid os.'));
                }
            })
            .catch((error: Error) => {
                log.error({ moduleName, message: 'Error arraying nwPackage.', meta: { error } });
                reject(error);
            });
        });

        buildProjectPackage(nwPackage, project, os, projectName, resolution, useCompleteSnap)
        .then(() => buildFinalPackage(finalPackage, os, projectName, filename))
        .then(() => {
            nwPackage.finalize();
            resolve(finalPackage.getStream());
        })
        .catch((error: Error) => reject(error));
    });
}

function loadProject(projectPath: string): Promise<NodeJS.ErrnoException | string> {
    // Remove end of line and escape single quotes
    return fileSystemUtils.readTextFile(projectPath).then((project: string) => project.replace(/\r?\n|\r/g, '').replace(/'/g, "\\'"));
}

export default function handleExecGeneration(projectPath: string, params: ExecGenerationRequestParams): Promise<NodeJS.ErrnoException | Error | NodeJS.ReadableStream> {
    return loadProject(projectPath).then((project: string) => {
        params.project = project;

        const validationError = validateParams(params);
        if (validationError) {
            const errorMessage = `Error validating parameters: ${validationError.message}`;
            throw {
                error: new Error(errorMessage),
                status: 400
            };
        }
        
        return buildPackages(params);
    });
}
