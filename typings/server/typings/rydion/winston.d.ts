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

    export interface Transport {

    }

    export interface Transports {
        File: Transport;
        Console: Transport;
        Loggly: Transport;
    }

    export var transports: Transports;

    export function add(transport: Transport, options: any): void;
    export function remove(transport: Transport): void;

    export function log(level: string, message: string, metadata?: any): void;
    export function debug(message: string, metadata?: any): void;
    export function info(message: string, metadata?: any): void;
    export function warn(message: string, metadata?: any): void;
    export function error(message: string, metadata?: any): void;
}