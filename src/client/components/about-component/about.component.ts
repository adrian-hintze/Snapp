import { Component } from '@angular/core';

import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
    selector: 'snapp-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    providers: [Modal]
})

export default class AboutComponent {
    constructor(public modal: Modal) {

    }

    onClick() {
        this.modal.alert()
        .size('lg')
        .title('About')
        .body(`
            <b>Snapp<i>!</i></b> was developed in 2015 by <b>Adrian Hintze</b> as his end of course project under the supervision
			of <a href="https://www.cs.upc.edu/~jdelgado/" target="_blank"  class="linked-name"><b>Jordi Delgado</b></a>
			(<a href="http://www.fib.upc.edu/en.html" target="_blank" class="linked-institution">FIB</a>-<a href="http://www.upc.edu/?set_language=en" target="_blank" class="linked-institution">UPC</a>) and
			<a href="https://github.com/bromagosa" target="_blank" class="linked-name">Bernat Romagosa</a>
			(<a href="http://edutec.citilab.eu/" target="_blank" class="linked-institution">Edutec</a>-<a href="http://citilab.eu/en" target="_blank" class="linked-institution">Citilab</a>)
			<br><br>
			<b>Snapp<i>!</i></b> is open source and is available at <a href="https://github.com/Rydion/Snapp" target="_blank" class="linked-institution">GitHub</a>
			<br><br>
			If you have any suggestions or find any issues with the application you can contact the author at <b>hintze.adrian AT gmail DOT com</b>
        `)
        .open();
    }
}