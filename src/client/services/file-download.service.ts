/**
 * file-download.service.ts
 *
 * Created on: 2016-11-01
 *     Author: Adrian Hintze
 *
 */

import { Injectable } from '@angular/core';

import { saveAs } from 'file-saver';

export interface FileDownloadServiceResponse {
    status: number;
    errorResponse?: any;
    fileSizeLimit?: any;
}

function arrayBufferToString(arrayBuffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, <any>(new Uint8Array(arrayBuffer)));
}

@Injectable()
export class FileDownloadService {
    public post(url: string, body: FormData) {
        return new Promise<FileDownloadServiceResponse>((resolve, reject) => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();

            const url: string = '/gen-exec';
            xhr.open('POST', url, true);

            xhr.responseType = 'arraybuffer';

            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    const { status } = xhr;
                    if (status === 200) {
                        const contentDisposition: string | null = this.getResponseHeader('content-disposition');
                        const contentType: string | null = this.getResponseHeader('content-type');
                        if (!contentDisposition || !contentType) {
                            // If any of the headers is missing we suppose a server error
                            resolve({ status: 500 });
                            return;
                        }

                        const filenamePattern: RegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        const regExResults: RegExpExecArray = <RegExpExecArray>filenamePattern.exec(contentDisposition);
                        const filename: string = regExResults[1];
                        const blob: Blob = new Blob([this.response], { type: contentType });

                        saveAs(blob, filename);
                        resolve({ status });
                        return;
                    }

                    // Error
                    try {
                        const textResponse = arrayBufferToString(xhr.response);
                        const jsonResponse = JSON.parse(textResponse);
                        resolve({ status, errorResponse: jsonResponse });
                    }
                    catch (error) {
                        resolve({ status });
                    }
                }
            });

            xhr.addEventListener('error', error => reject(error));

            xhr.send(body);
        }); 
    }
}
