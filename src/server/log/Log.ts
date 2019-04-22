/**
 * Log.ts
 *
 * Created on: 2018-06-19
 *     Author: Adrian Hintze
 *
 */

import * as path from 'path';

import * as winston from 'winston';

import { makeDirSync } from '../utils/FileSystem';

const WinstonDailyRotateFile = require('winston-daily-rotate-file');
const defaultPath = path.join(global.rootDir, '..', 'logs', 'node');


export interface LogParameters {
    message?: string;
    moduleName: string;
    error?: Error;
    functionName?: string;
    meta?: any;
}

function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

export class Logger {
    static fromLogConf(conf: any): Logger {
        const { path: logPath } = conf;

        try {
            makeDirSync(logPath);
        }
        catch (error) {
            throw new Error(`Unable to create log directory: ${logPath}.`);
        }

        const dailyRotateFileTransport: any = new WinstonDailyRotateFile({
            filename: 'snapp.%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: logPath,
            zippedArchive: false,
            maxFiles: '365d'
        });

        const productionFormat = winston.format.printf((info) => {
            return `<${info.level.toUpperCase()}> [${info.timestamp}] - ${info.message} ${(info.meta && Object.keys(info.meta).length ? '\n' + JSON.stringify(info.meta) : '')}`;
        });

        const logger: winston.Logger = winston.createLogger({
            level: isProduction ? 'info' : 'silly',
            format: winston.format.combine(
                winston.format.timestamp(),
                productionFormat
            ),
            transports: [
                dailyRotateFileTransport
            ]
        });

        if (!isProduction()) {
            logger.add(new winston.transports.Console({
                format: winston.format.simple()
            }));
        }

        return new Logger(logger);
    }

    debug(params: LogParameters): void {
        this._logger.debug(this._formatLogMessage(params), params.meta ? { meta: params.meta } : null);
    }

    info(params: LogParameters): void {
        this._logger.info(this._formatLogMessage(params), params.meta ? { meta: params.meta } : null);
    }

    warn(params: LogParameters): void {
        this._logger.warn(this._formatLogMessage(params), params.meta ? { meta: params.meta } : null);
    }

    error(params: LogParameters): void {
        this._logger.error(this._formatLogMessage(params), params.meta ? { meta: params.meta } : null);
    }

    private constructor(private _logger: winston.Logger) {

    }

    private _formatLogMessage({ error, functionName, message, moduleName }: LogParameters): string {
        const separator: string = '::';
        let result: string = moduleName;
        result += functionName ? (separator + functionName) : '';
        result += message ? (' - ' + message) : '';
        if (error) {
            result += '\nError information:\n';
            result += error.message ? `\tMessage: ${error.message}` : '';
            result += error.stack ? `\n\t${error.stack}` : '';
        }
        return result;
    }
}

export const logger: Logger = Logger.fromLogConf({ path: defaultPath });
