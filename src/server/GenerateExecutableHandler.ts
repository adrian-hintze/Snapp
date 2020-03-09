/**
 * GenerateExecutableHandler.ts
 *
 * Created on: 2016-09-25
 *     Author: Adrian Hintze
 *
 */

import * as path from 'path';

import streamToArray = require('stream-to-array');

import SaxParser from './Xml';
import Zip from './Zip';
import Resolution from './Resolution';

import * as fileSystemUtils from './utils/FileSystem';
import * as validationUtils from './utils/Validation';

import { logger } from './log/Log';

const moduleName: string = path.basename(__filename);
const resourcesDir: string = path.join(global.rootDir, '..', 'resources');
const unixExecutablePermissions: number = 0o0755;
const macToolbarCode: string =
`
var nwWin = nw.Window.get();
var nwMenu = new nw.Menu({ type: 'menubar' });
nwMenu.createMacBuiltin('{{project_name}}', {
    hideEdit: true,
    hideWindow: true
});
nwWin.menu = nwMenu;
var closeShortcut = new nw.Shortcut({
    key: 'Command+Q',
    active: function () { nwWin.close(); }
});
var closeWindowShortcut = new nw.Shortcut({
    key: 'Command+W',
    active: function () { nwWin.close(); }
});
var minimizeShortcut = new nw.Shortcut({
    key: 'Command+M',
    active: function () { nwWin.minimize(); }
});
nw.App.registerGlobalHotKey(closeShortcut);
nw.App.registerGlobalHotKey(closeWindowShortcut);
nw.App.registerGlobalHotKey(minimizeShortcut);
nwWin.on('focus', function () {
    nw.App.registerGlobalHotKey(closeShortcut);
    nw.App.registerGlobalHotKey(closeWindowShortcut);
    nw.App.registerGlobalHotKey(minimizeShortcut);
});
nwWin.on('blur', function () {
    nw.App.unregisterGlobalHotKey(closeShortcut);
    nw.App.unregisterGlobalHotKey(closeWindowShortcut);
    nw.App.unregisterGlobalHotKey(minimizeShortcut);
});
`;
const winFullscreenCode: string =
`
var nwWin = nw.Window.get();
var fullscreenShortcut = new nw.Shortcut({
    key: 'F11',
    active: function () { nwWin.toggleFullscreen(); }
});
nw.App.registerGlobalHotKey(fullscreenShortcut);
`;

interface ErrorFeedback {
    message?: string;
    code?: string;
}

interface ExecGenerationRequestParams {
    filename: string;
    project: string;
    projectName: string;
    os: string;
    resolution: string;
    useCompleteSnap: boolean;
}

interface PackageJsonContentsWindowProperty {
    icon: string;
    title: string;
    resizable: boolean;
    width: number;
    height: number;
}

interface PackageJsonContents {
    name: string;
    main: string;
    nodejs: boolean;
    'node-remote': string;
    product_string?: string;
    window: PackageJsonContentsWindowProperty;
}

function validateFilename(filename: string): Promise<void> {
    if (validationUtils.validateString(filename, false)) {
        return Promise.reject({ message: 'validateFilename1' });
    }

    return Promise.resolve();
}

function validateFileContentsAndReturnProjectName(fileContents: string): Promise<string> {
    if (validationUtils.validateString(fileContents, false)) {
        return Promise.reject({
            message: 'Cannot process an empty project.',
            code: 'XML_VALIDATION_ERROR'
        });
    }

    let projectName: string = '';
    const saxParser: SaxParser = new SaxParser();

    const returnPromise = new Promise<string>((resolve, reject) => {
        saxParser.onError((error) => reject({
            message: error.message,
            code: 'XML_VALIDATION_ERROR'
        }));

        saxParser.onTag((tag) => {
            const mainTagName = 'project';
            if (tag.name === mainTagName) {
                const nameAttributeName = 'name';
                projectName = <string>tag.attributes[nameAttributeName];
            }
        });

        saxParser.onEnd(() => {
            if (!projectName) {
                reject({
                    message: 'Unable to find the project name.',
                    code: 'XML_PROPERTY_MISSING'
                });
                return;
            }

            resolve(projectName);
        });
    });

    saxParser.parse(fileContents);

    return returnPromise;
}

function validateOs(os: string): Promise<void> {
    const validOsValues: Array<string> = ['mac64', 'lin32', 'lin64', 'win32', 'win64'];
    if (validationUtils.validateString(os, false, validOsValues)) {
        return Promise.reject({ message: 'validateOs1' });
    }

    return Promise.resolve();
}

function validateResolution(resolution: string): Promise<void> {
    if (validationUtils.validateString(resolution, false)) {
        return Promise.reject({ message: 'validateResolution1' });
    }

    try {
        Resolution.fromString(resolution);
        return Promise.resolve();
    }
    catch (error) {
        return Promise.reject({ message: 'validateResolution2' });
    }
}

function validateUseCompleteSnap(useCompleteSnap: boolean): Promise<void> {
    if (validationUtils.validateBoolean(useCompleteSnap)) {
        return Promise.reject({ message: 'validateUseCompleteSnap1' });
    }

    return Promise.resolve();
}

async function validateParamsAndRetrieveProjectName({ filename, project, os, resolution, useCompleteSnap }: ExecGenerationRequestParams): Promise<string> {
    const validationPromises = [
        validateFilename(filename),
        validateOs(os),
        validateResolution(resolution),
        validateUseCompleteSnap(useCompleteSnap)
    ];

    await Promise.all(validationPromises);
    return validateFileContentsAndReturnProjectName(project);
}

function buildPackageJson(os: string, projectName: string, resolution: Resolution): string {
    const contents: PackageJsonContents = {
        name: 'snapapp',
        main: 'snap.html',
        nodejs: true,
        'node-remote': '<all_urls>',
        window: {
            icon: 'lambda.png',
            title: projectName,
            resizable: true,
            width: resolution.getWidth(),
            height: resolution.getHeight()
        }
    };

    return JSON.stringify(contents);
}

function buildGui(gui: string, project: string, os: string, projectName: string): string {
    let result: string = gui + '\n';
    if (os === 'mac64') {
        result += macToolbarCode.replace('{{project_name}}', projectName) + '\n';
    }
    if (os === 'win32' || os === 'win64') {
        result += winFullscreenCode + '\n';
    }
    return result + `IDE_Morph.prototype.snapproject = '${project}';`
}

function buildProjectPackage(projectPackage: Zip, project: string, os: string, projectName: string, resolution: Resolution, useCompleteSnap: boolean): Promise<void> {
    const version: string = useCompleteSnap ? 'full' : 'reduced';

    projectPackage.append(buildPackageJson(os, projectName, resolution), { name: 'package.json' });
    projectPackage.directory(path.join(resourcesDir, 'snap', version, 'files'), '');

    return fileSystemUtils.readTextFile(path.join(resourcesDir, 'snap', version, 'gui', 'gui.js'))
    .then((gui) => {
        projectPackage.append(buildGui(gui, project, os, projectName), { name: path.join('src', 'gui.js') });
    })
    .catch((error: NodeJS.ErrnoException) => {
        logger.error({ moduleName, message: 'Unable to read gui file.', meta: { version: version, errorCode: error.code } });
        throw error;
    });
}

function buildFinalPackage(finalPackage: Zip, os: string, filename: string): Promise<void> {
    switch (os) {
        case 'mac64': {
            const rootDir: string = `${filename}.app`;

            finalPackage.directory(path.join(resourcesDir, 'nw', os, 'Contents'), path.join(rootDir, 'Contents'));
            finalPackage.file(path.join(resourcesDir, 'icons', 'lambda.icns'), { name: path.join(rootDir, 'Contents', 'Resources', 'lambda.icns') });
            
            return fileSystemUtils.readTextFile(path.join(resourcesDir, 'conf', os, 'Info.plist'))
            .then((plistTemplate) => {
                const plist = plistTemplate.replace('{{filename}}', filename).replace('{{short_filename}}', filename.length < 16 ? filename : 'Snapp');
                finalPackage.append(plist, { name: path.join(rootDir, 'Contents', 'Info.plist') });
            })
            .then(() => {
                return fileSystemUtils.readTextFile(path.join(resourcesDir, 'conf', os, 'InfoPlist.strings'));
            })
            .then((infoplistTemplate) => {
                const infoplist = infoplistTemplate.replace('{{filename}}', filename).replace('{{short_filename}}', filename.length < 16 ? filename : 'Snapp');
                finalPackage.append(infoplist, { name: path.join(rootDir, 'Contents', 'Resources', 'en.lproj', 'InfoPlist.strings') });
            })
            .catch((error: NodeJS.ErrnoException) => {
                logger.error({ moduleName, message: 'Unable to read mac conf files.', meta: { os, errorCode: error.code } });
                throw error;
            });
        }
        case 'lin64':
        case 'lin32': {
            const rootDir: string = `${filename}.snapp`;

            finalPackage.directory(path.join(resourcesDir, 'nw', os, 'lib'), rootDir);
            finalPackage.file(path.join(resourcesDir, 'icons', 'lambda.png'), { name: path.join(rootDir, 'lambda.png') });

            const readFilesPromises: Array<Promise<void>> = [
                fileSystemUtils.readTextFile(path.join(resourcesDir, 'conf', 'linux', 'launcher.sh'))
                .then((launcherTemplate: string) => {
                    const launcher: string = launcherTemplate.replace('<filename>', filename);
                    finalPackage.append(launcher, { name: path.join(rootDir, 'launcher.sh'), mode: unixExecutablePermissions });
                })
                .catch((error: NodeJS.ErrnoException) => {
                    logger.error({ moduleName, message: 'Unable to read linux launcher.sh.', meta: { os, errorCode: error.code } });
                    throw error;
                }),
                fileSystemUtils.readTextFile(path.join(resourcesDir, 'conf', 'linux', 'app.desktop'))
                .then((launcherTemplate: string) => {
                    const launcher: string = launcherTemplate.replace('<filename>', filename);
                    finalPackage.append(launcher, { name: `${filename}.desktop`, mode: unixExecutablePermissions });
                })
                .catch((error: NodeJS.ErrnoException) => {
                    logger.error({ moduleName, message: 'Unable to read linux app.desktop.', meta: { os, errorCode: error.code } });
                    throw error;
                })
            ];

            return Promise.all(readFilesPromises).then(() => { });
        }
        case 'win64':
        case 'win32':
            finalPackage.directory(path.join(resourcesDir, 'nw', os, 'lib'), filename);
            return Promise.resolve();
        default:
            logger.error({ moduleName, message: 'Invalid os.', meta: { os } });
            return Promise.reject(new Error('Invalid os.'));
    }
}

function buildPackages(params: ExecGenerationRequestParams): Promise<NodeJS.ReadableStream> {
    return new Promise<NodeJS.ReadableStream>((resolve, reject) => {
        const finalPackage: Zip = new Zip(
            (error: any) => reject(error),
            () => logger.info({ moduleName, message: 'Final package finished.' })
        );

        const { filename, os } = params;
        const nwPackage: Zip = new Zip((error: any) => reject(error), () => {
            streamToArray(nwPackage.getStream())
            .then((parts: Array<Buffer>) => {
                const buffer = Buffer.concat(parts);
                switch (os) {
                    case 'mac64':
                        finalPackage
                        .append(buffer, { name: path.join(`${filename}.app`, 'Contents', 'Resources', 'app.nw'), mode: unixExecutablePermissions })
                        .finalize();
                        break;
                    case 'lin64':
                    case 'lin32':
                        fileSystemUtils.readFile(path.join(resourcesDir, 'nw', os, 'bin', 'nw'))
                        .then((file) => {
                            finalPackage
                            .append(Buffer.concat([file, buffer]), { name: path.join(`${filename}.snapp`, filename), mode: unixExecutablePermissions })
                            .finalize();
                        })
                        .catch((error: NodeJS.ErrnoException) => reject(error));
                        break;
                    case 'win64':
                    case 'win32': {
                        fileSystemUtils.readFile(path.join(resourcesDir, 'nw', os, 'exe', 'nw.exe'))
                        .then((file) => {
                            finalPackage
                            .append(Buffer.concat([file, buffer]), { name: path.join(filename, `${filename}.exe`) })
                            .finalize();
                        })
                        .catch((error: NodeJS.ErrnoException) => reject(error));
                        break;
                    }
                    default:
                        logger.error({ moduleName, message: 'Invalid os.', meta: { os } });
                        reject(new Error('Invalid os.'));
                }
            })
            .catch((error: Error) => {
                logger.error({ moduleName, message: 'Error arraying nwPackage.', error});
                reject(error);
            });
        });

        const resolution: Resolution = Resolution.fromString(params.resolution);
        buildProjectPackage(nwPackage, params.project, os, params.projectName, resolution, params.useCompleteSnap)
            .then(() => buildFinalPackage(finalPackage, os, filename))
            .then(() => {
                nwPackage.finalize();
                resolve(finalPackage.getStream());
            })
            .catch(error => reject(error));
    });
}

function loadProject(projectPath: string): Promise<string> {
    return fileSystemUtils
        .readTextFile(projectPath)
        .then((project) => project.replace(/\r?\n|\r/g, '').replace(/'/g, "\\'")); // Remove end of line and escape single quotes
}

export default async function handleExecGeneration(projectPath: string, params: ExecGenerationRequestParams): Promise<NodeJS.ReadableStream> {
    try {
        params.project = await loadProject(projectPath);
    }
    catch (e) {
        throw {
            code: '',
            error: new Error('Error reading project file.'),
            status: 500
        };
    }

    try {
        params.projectName = await validateParamsAndRetrieveProjectName(params);
    }
    catch (validationError) {
        const { message = '', code = '' } = <ErrorFeedback>validationError;
        const errorMessage = `Error validating parameters: ${message}.`;
        throw {
            code,
            error: new Error(errorMessage),
            status: 400
        };
    }

    return await buildPackages(params);
}
