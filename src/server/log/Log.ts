/**
 * Log.js
 *
 * Created on: 2016-28-09
 *     Author: Adrian Hintze @Rydion
 *
 */

declare var winstonDailyRotator: any; // Ugly hack, make a d.ts file for winston-daily-rotate-file

'use strict';

import * as path from 'path';

import * as winston from 'winston';
import * as winstonDailyRotator from 'winston-daily-rotate-file';

import * as fileSystemUtils from '../utils/FileSystem';

const defaultPath = path.join(global.rootDir, '..', 'logs', 'node');
const defaultLocale = 'es-ES';
let logLocale = defaultLocale;

function timeStamper() {
    return new Date().toLocaleString(logLocale);
}

function formatter({level, timestamp, message, meta}: winston.FileFormatterOptions) {
    // <LEVEL> [Date] - message
    // {meta}
    return '<' + level.toUpperCase() + '> [' + timestamp() + '] - ' + message +
           (meta && Object.keys(meta).length ? '\n' + JSON.stringify(meta) : '');
}

interface LogParameters {
    moduleName: string;
    message: string;
    functionName?: string;
    meta?: any;
}

function formatLogMessage({moduleName, functionName, message}: LogParameters): string {
    const separator = '::';
    let result = moduleName + separator;
    result += functionName ? functionName + separator : '';
    result += message;
    return result;
}

type LogFunction = (params: LogParameters) => void;

interface LogFunctions {
    debug: LogFunction;
    info: LogFunction;
    warn: LogFunction;
    error: LogFunction;
    destructureError: (error: any) => { message: string, stack: string };
}

const logFunctions: LogFunctions = {
    debug: (params: LogParameters) => winston.debug(formatLogMessage(params), params.meta || { }),
    info: (params: LogParameters) => winston.info(formatLogMessage(params), params.meta || { }),
    warn: (params: LogParameters) => winston.warn(formatLogMessage(params), params.meta || { }),
    error: (params: LogParameters) => winston.error(formatLogMessage(params), params.meta || { }),
    destructureError: (error: any) => ({ message: error.message, stack: error.stack })
};

interface LogInitParameters {
    path?: string;
    locale?: string;
}

export default function (params?: LogInitParameters): LogFunctions {
    if (!params) {
        return logFunctions;
    }

    const { path: logPath = defaultPath, locale = defaultLocale } = params;

    logLocale = locale;

    // TODO -normal- Catch and handle the possible exception
    fileSystemUtils.makeDirSync(logPath);

    winston.remove(winston.transports.Console);

    winston.add(winston.transports.Console, {
        formatter,
        timestamp: timeStamper,
        level: 'silly',
        handleExceptions: false,
        exitOnError: true
    });
    winston.add(winstonDailyRotator, {
        formatter,
        name: 'SnappProductionLog',
        datePattern: '.yyyy-MM-dd.log',
        filename: path.join(logPath, 'nt_log'),
        maxsize: 100000000, // 100 MB file size limit, in bytes - 100000000
        maxFiles: 10, // 10 files per day (overwrite the first one if it reaches the limit)
        timestamp: timeStamper,
        json: false, // needs to be set to false for the formatter to be used
        level: 'info',
        handleExceptions: false,
        exitOnError: true
    });

    return logFunctions;
};
