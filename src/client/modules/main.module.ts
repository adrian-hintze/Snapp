import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BusyModule } from 'angular2-busy';

import MainComponent from '../components/main-component/main.component';
import SnapProjectSubmitFormComponent from '../components/snap-project-submit-form-component/snap-project-submit-form.component';


import '../../../node_modules/angular2-busy/build/style/busy.css';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        BusyModule
    ],
    declarations: [
        MainComponent,
        SnapProjectSubmitFormComponent
    ],
    bootstrap: [
        MainComponent
    ]
})

export default class MainModule { }
