/**
 * main.module.ts
 *
 * Created on: 2016-11-01
 *     Author: Adrian Hintze
 *
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { QsAngular2BusyModule } from 'qs-angular2-busy';

import { ModalModule } from 'ngx-modialog-7';
import { BootstrapModalModule } from 'ngx-modialog-7/plugins/bootstrap';

import MainComponent from '../components/main-component/main.component';
import SnapProjectSubmitFormComponent from '../components/snap-project-submit-form-component/snap-project-submit-form.component';
import AboutComponent from '../components/about-component/about.component';

import { FileDownloadService } from '../services/file-download.service';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        QsAngular2BusyModule,
        ModalModule.forRoot(),
        BootstrapModalModule
    ],
    declarations: [
        MainComponent,
        SnapProjectSubmitFormComponent,
        AboutComponent
    ],
    providers: [
        FileDownloadService
    ],
    bootstrap: [
        MainComponent
    ]
})
export default class MainModule { }
