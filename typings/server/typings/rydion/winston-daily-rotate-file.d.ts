declare module 'winston-daily-rotate-file' {
    import * as winston from 'winston';

    // TODO -low- The winston interface is all fucked up, redo
    // this file shouldn't be any more complicated than
    // export default function (options?: winston.DailyRotateFileTransportOptions | undefined): winston.DailyRotateFileTransportInstance;

    namespace WinstonDailyRotateFile { }

    export = WinstonDailyRotateFile;
}
