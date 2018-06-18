
/*declare module 'archiver' {
    import * as fs from 'fs';
    import * as stream from 'stream';
    import * as express from 'express';

    type Format = 'zip' | 'tar';

    interface ArchiverOptions {
        store?: boolean;
        gzip?: boolean;
        gzipOptions?: {
            level: number,
        };
        highWaterMark?: number;
    }

    export function archiver(format: Format, options?: ArchiverOptions): Archiver;
    export function create(format: string, options?: ArchiverOptions): Archiver;
    export function registerFormat(format: string, module: Function): void;

    interface EntryData {
        name?: string;
        prefix?: string;
        stats?: string;
    }

    export interface Archiver extends stream.Transform {
        abort(): this;
        append(source: stream.Readable | Buffer | string, name?: EntryData): this;
        bulk(mappings: any): this;
        directory(dirpath: string, options: EntryData | string, data?: EntryData): this;
        file(filename: string, data: EntryData): this;
        finalize(): this;
        pipe(stream: fs.WriteStream | express.Response): void;
        setFormat(format: string): this;
        setModule(module: Function): this;
        pointer(): number;
        use(plugin: Function): this;
    }
}
*/
