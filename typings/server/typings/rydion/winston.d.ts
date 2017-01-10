declare module 'winston' {
    export interface FileFormatterOptions {
        timestamp: () => string,
        level: string,
        message: string,
        meta: any
    }

    export interface GenericTransportOptions {
        exitOnError: boolean;
    }
}