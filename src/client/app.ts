import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import MainModule from './modules/main.module';

import './app.css';

if (process.env.NODE_ENV === 'production') {
    enableProdMode();
}

platformBrowserDynamic()
.bootstrapModule(MainModule)
.catch((error: Error) => {
    console.error(error);
    alert('Unable to load Snapp!');
});
