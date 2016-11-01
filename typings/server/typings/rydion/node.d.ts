declare namespace NodeJS {
    export interface SnappGlobalConf {
        port: number;
        uploadFileSizeLimit: number;
    }

    export interface Global {
        rootDir: string;
        conf: SnappGlobalConf;
    }
}