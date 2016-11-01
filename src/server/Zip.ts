/**
 * Zip.ts
 *
 * Created on: 2016-09-26
 *     Author: Adrian Hintze @Rydion
 *
 */

'use strict';

import * as archiver from 'archiver';
import { Archiver } from 'archiver';

const defaultHighWaterMark = 100000000;

export default class Zip {
    public constructor(onError: Function, onFinish: Function) {
        this.zip = archiver.create('zip', { highWaterMark: defaultHighWaterMark });
        this.zip.on('error', onError);
        this.zip.on('finish', onFinish);
    }

    public directory(srcPath: string, dstPath: string): Zip {
        this.zip.directory(srcPath, dstPath);
        return this;
    }

    public file(path: string, options: any): Zip {
        this.zip.file(path, options);
        return this;
    }

    public append(contents: NodeBuffer | string, options: any): Zip {
        this.zip.append(contents, options);
        return this;
    }

    public finalize(): void {
        this.zip.finalize();
    }

    public getStream(): NodeJS.ReadableStream {
        return this.zip;
    } 

    private zip: Archiver;
}
