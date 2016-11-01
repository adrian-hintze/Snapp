declare module 'archiver' {
    import * as fs from 'fs';
    import * as stream from 'stream';

    interface NameWrapper {
        name?: string;
    }

    interface ArchiverOptions {

    }
    
    export interface Archiver extends stream.Transform {
        pipe(writeStream: fs.WriteStream): void;
        append(source: fs.ReadStream | Buffer | string, name: NameWrapper): void;
        directory(destPath: string, filename: string, options?: ArchiverOptions): void;
        file(path: string, options?: ArchiverOptions): void;
        finalize(): void;
    }

    export function create(format: string, options?: ArchiverOptions): Archiver;
}
