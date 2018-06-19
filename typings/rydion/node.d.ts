declare namespace NodeJS {
    export interface SnappGlobalConf {
        port?: number;
        uploadFileSizeLimit?: number;
        compressStaticFiles?: boolean;
    }

    export interface Global {
        rootDir: string;
        conf: SnappGlobalConf;
    }
}
