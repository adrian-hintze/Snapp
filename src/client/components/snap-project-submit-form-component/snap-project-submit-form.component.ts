/**
 * snap-project-submit-form.component.ts
 *
 * Created on: 2016-11-01
 *     Author: Adrian Hintze @Rydion
 *
 */

import { Component } from '@angular/core';

import { FileDownloadService, FileDownloadServiceResponse } from '../../services/file-download.service';

interface SnapProjectSubmitFormData {
    project: File | null;
    resolution: string;
    os: string;
    useCompleteSnap: boolean;
}

interface SelectOption {
    label: string;
    value: any;
}

@Component({
    selector: 'snap-project-submit-form',
    templateUrl: './snap-project-submit-form.component.html',
    styleUrls: ['./snap-project-submit-form.component.css']
})
export default class SnapProjectSubmitFormComponent {
    constructor() {
        this.formData = {
            project: null,
            resolution: '1024x768',
            os: 'win64',
            useCompleteSnap: false
        };

        // TODO -normal- Move to a service
        function detectOs() {
            // Detect operating system
            let osName = 'win';
            if (navigator.userAgent.indexOf('Mac') !== -1) {
                osName = 'mac';
            }
            if (navigator.userAgent.indexOf('Linux') !== -1) {
                osName = 'lin';
            }

            // Try to detect if it's a 64 or 32 bit machine
            // Most of the time this doesn't work so well
            const is64bit =
                navigator.platform === 'Win64' || navigator.platform === 'Linux x86_64' || // If this are set just trust them
                navigator.appVersion.indexOf('WOW64') > -1 || navigator.appVersion.indexOf('x86_64') > -1 || // In case the fields above aren't set correctly
                navigator.userAgent.indexOf('WOW64') > -1 || navigator.userAgent.indexOf('x86_64') > -1; // Firefox's appVersion field is kinda lacking

            return osName + (is64bit ? '64' : '32');
        }

        this.formData.os = detectOs();
    }

    public onSelectFile(event: any): void {
        const input: HTMLInputElement = event.target;
        if (input && input.files) {
            this.formData.project = input.files.item(0);
        }
    }

    public onSubmit(): void {
        const formData: FormData = new FormData();
        formData.append('project', this.formData.project);
        formData.append('resolution', this.formData.resolution);
        formData.append('os', this.formData.os);
        formData.append('useCompleteSnap', this.formData.useCompleteSnap.toString());

        const url: string = '/gen-exec';
        this.busy = new FileDownloadService().post(url, formData)
        .then((response: FileDownloadServiceResponse) => {
            const unknownErrorResponse = 'Unknown client error. Please reload the page and try again. If the problem persists open a new GitHub issue (link in about section).';
            const { status, errorResponse } = response;

            if (status === 413) {
                if (!errorResponse) {
                    alert(unknownErrorResponse);
                    return;
                }

                const { fileSizeLimit } = errorResponse;
                alert(`Sorry, but this online version of Snapp! only accepts projects up to ${fileSizeLimit / 1000000} MB.`);
            }
            else if (status === 500) {
                alert('Whoops! Something went wrong server-side. Please try again later. If the problem persists open a new issue on GitHub.');
            }
            else if (status === 400) {
                if (!errorResponse) {
                    alert(unknownErrorResponse);
                    return;
                }

                const { code } = errorResponse;
                switch (code) {
                    case 'REJECTED_FILE_EXTENSION':
                        alert('Please upload only XML files (myproject.xml). Other file types will not be processed.');
                        break;
                    case 'XML_PROPERTY_MISSING':
                    case 'XML_VALIDATION_ERROR':
                        alert('There seems to be an error with your exported Snap! project. Please make sure that it has been saved correctly.');
                        break;
                    default:
                        alert(unknownErrorResponse);
                        break;
                };               
            }
        })
        .catch(error => console.log(error));
    }

    public resolutions: Array<string> = ['1280x960', '1152x864', '1024x768', '800x600', '600x450'];
    public operatingSystems: Array<SelectOption> = [
        { label: 'Windows 64 bits', value: 'win64' },
        { label: 'OS X 64 bits', value: 'mac64' },
        { label: 'Linux 64 bits', value: 'lin64' },
        { label: 'Windows 32 bits', value: 'win32' },
        { label: 'OS X 32 bits', value: 'mac32' },
        { label: 'Linux 32 bits', value: 'lin32' }
    ];

    public formData: SnapProjectSubmitFormData;
    public busy: Promise<any>;
}
