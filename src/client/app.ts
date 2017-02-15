import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import MainModule from './modules/main.module';

import './app.css';
import 'bootstrap/dist/css/bootstrap.css';

if (process.env.ENV === 'production') {
    enableProdMode();
}

platformBrowserDynamic()
.bootstrapModule(MainModule)
.catch((error) => {
    console.log(error);
    alert('Unable to load Snapp!');
});
