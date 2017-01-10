/**
 * file-download.service.ts
 *
 * Created on: 2016-11-01
 *     Author: Adrian Hintze @Rydion
 *
 */

import { Injectable } from '@angular/core';

const fileSaver = require('file-saver');


@Injectable()
export class FileDownloadService {
    public post(url: string, body: Object | FormData) {
        return new Promise<number | Error>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = '/gen-exec';

            xhr.open('POST', url, true);
            xhr.responseType = 'blob';

            // xhr.onreadystatechange
            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const header = this.getResponseHeader('content-disposition');
                        const filenamePattern = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        const filename = filenamePattern.exec(header)[1];
                        const blob = new Blob([this.response], { type: 'application/zip' });
                        fileSaver.saveAs(blob, filename);
                    }
                    resolve(xhr.status);
                }
            });

            xhr.addEventListener('error', error => reject(error));

            xhr.send(body);
        }); 
    }
}
