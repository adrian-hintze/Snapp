/**
 * FileSystem.js
 *
 * Created on: 2016-09-28
 *     Author: Adrian Hintze @Rydion
 *
 */

'use strict';

import * as fs from 'fs';

import * as mkdirp from 'mkdirp';

export function isDir(path: string): Promise<NodeJS.ErrnoException | boolean> {
    return new Promise((resolve, reject) => {
        fs.stat(path, (error, stat) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stat.isDirectory());
        });
    });
}

export function isDirSync(path: string): boolean {
    return fs.statSync(path).isDirectory();
}

export function dirExists(path: string): Promise<NodeJS.ErrnoException | boolean> {
    return isDir(path)
           .then(result => result)
           .catch((error) => {
               if (error.code === 'ENOENT') {
                   return false;
               }
               throw error;
           });
}

export function dirExistsSync(path: string): boolean {
    try {
        return isDirSync(path);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}

export function makeDir(path: string): Promise<any | undefined> {
    return new Promise((resolve, reject) => {
        dirExists(path)
        .then((exists) => {
            if (exists) {
                resolve();
                return;
            }

            mkdirp(path, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        })
        .catch(error => reject(error));
    });
}

export function makeDirSync(path: string): void {
    if (!dirExistsSync(path)) {
        mkdirp.sync(path);
    }
}

export function readFile(path: string): Promise<NodeJS.ErrnoException | Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, buffer) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(buffer);
        });
    });
}

export function readFileSync(path: string): Buffer {
    return fs.readFileSync(path);
}

export function readTextFile(path: string, encoding: string = 'utf8'): Promise<NodeJS.ErrnoException | string> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (error, text) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(text);
        });
    });
}

export function readTextFileSync(path: string, encoding: string = 'utf8'): string {
    return fs.readFileSync(path, encoding);
}

export function readDir(path: string): Promise<NodeJS.ErrnoException | string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (error, contents) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(contents);
        });
    });
}

export function readDirSync(path: string): string[] {
    return fs.readdirSync(path);
}
