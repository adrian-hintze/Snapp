import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BusyModule } from 'angular2-busy';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import MainComponent from '../components/main-component/main.component';
import SnapProjectSubmitFormComponent from '../components/snap-project-submit-form-component/snap-project-submit-form.component';
import AboutComponent from '../components/about-component/about.component';


import '../../../node_modules/angular2-busy/build/style/busy.css';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        BusyModule,
        ModalModule.forRoot(),
        BootstrapModalModule
    ],
    declarations: [
        MainComponent,
        SnapProjectSubmitFormComponent,
        AboutComponent
    ],
    bootstrap: [
        MainComponent
    ]
})

export default class MainModule { }
