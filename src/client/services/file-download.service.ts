/**
 * file-download.service.ts
 *
 * Created on: 2016-11-01
 *     Author: Adrian Hintze @Rydion
 *
 */

import { Injectable } from '@angular/core';

const fileSaver = require('file-saver');


export interface FileDownloadServiceResponse {
    status: number;
    errorResponse?: any;
}

function arrayBufferToString(arrayBuffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
}

@Injectable()
export class FileDownloadService {
    public post(url: string, body: Object | FormData) {
        return new Promise<FileDownloadServiceResponse | Error>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = '/gen-exec';

            xhr.open('POST', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    const { status } = xhr;
                    if (status === 200) {
                        const contentDisposition = this.getResponseHeader('content-disposition');
                        const filenamePattern = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        const filename = filenamePattern.exec(contentDisposition)[1];
                        const contentType = this.getResponseHeader('content-type');
                        const blob = new Blob([this.response], { type: contentType });
                        fileSaver.saveAs(blob, filename);
                        resolve({ status });
                        return;
                    }

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
