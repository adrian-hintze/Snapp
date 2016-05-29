//change this to whatever server Snapp is going to be deployed
var url = 'http://yourdomain/gen_exec';

//spinner
var opts = {
	lines: 13, // The number of lines to draw
	length: 28, // The length of each line
	width: 14, // The line thickness
	radius: 42, // The radius of the inner circle
	scale: 1, // Scales overall size of the spinner
	corners: 1, // Corner roundness (0..1)
	color: '#000', // #rgb or #rrggbb or array of colors
	opacity: 0.25, // Opacity of the lines
	rotate: 0, // The rotation offset
	direction: 1, // 1: clockwise, -1: counterclockwise
	speed: 1, // Rounds per second
	trail: 60, // Afterglow percentage
	fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
	zIndex: 10, // The z-index
	className: 'spinner', // The CSS class to assign to the spinner
	top: '50%', // Top position relative to parent
	left: '50%', // Left position relative to parent
	shadow: false, // Whether to render a shadow
	hwaccel: false, // Whether to use hardware acceleration
	position: 'absolute', // Element positioning
}

var spinner;
var spinnerTarget;

var OSName = 'win'; //use windows by default
var is64bit = true; //suppose 64 bit system

function tryTheImpossible() {
	//auto detect operating system
	if (navigator.userAgent.indexOf('Win') !== -1) OSName = 'win';
	if (navigator.userAgent.indexOf('Mac') !== -1) OSName = 'mac';
	if (navigator.userAgent.indexOf('Linux') !== -1) OSName = 'lin';
	
	//try to detect if it's a 64 or 32 bit machine
	is64bit =
		navigator.platform === 'Win64' || navigator.platform === 'Linux x86_64' || //if this are set just trust them
		navigator.appVersion.indexOf('WOW64') > -1 || navigator.appVersion.indexOf('x86_64') > -1 || //in case the fields above aren't set correctly
		navigator.userAgent.indexOf('WOW64') > -1 || navigator.userAgent.indexOf('x86_64') > -1; //firefox's appVersion field is kinda lacking
}

window.onload = function() {
	document.getElementById('fileinput').onchange = function () {
		handleFileSelect(this.files[0]);
	}
	
	document.getElementById('about').onclick = function () {
		document.getElementById('overlay-back').style.display = 'block';
		document.getElementById('overlayAbout').style.display = 'block';
	}
	
	document.getElementById('aboutClose').onclick = function () {
		document.getElementById('overlay-back').style.display = 'none';
		document.getElementById('overlayAbout').style.display = 'none';
	}
	
	document.getElementById('sendButton').onclick = function () {
		if (file) {
			uploadFile();
		}
		else {
			usage();
		}
	}
	
	document.getElementById('reducedAppRadio').onchange = function () {
		completeSnap = false;
	}
	
	document.getElementById('completeAppRadio').onchange = function () {
		completeSnap = true;
	}
	
	//get the os and processor type of the client
	tryTheImpossible();
	
	//set the default OS
	var value = is64bit ? '64' : '32';
	value = OSName + value;
    var element = document.getElementById('osSelector');
    element.value = value;
	
	spinnerTarget = document.getElementById('gui');
	spinner = new Spinner(opts);
};

var SnapProject = '';
var reader = new FileReader();
var file = null;
var file_name = 'Snap';

reader.onloadend = function () {
	SnapProject = reader.result;
	SnapProject = SnapProject.replace(/\r?\n|\r/g).replace(/'/g, "\\'"); // remove end of line and escape single quotes
};

function handleFileSelect(selectedFile) {
	if (!(selectedFile instanceof Blob)) {
		file = null;
		SnapProject = '';
		file_name = 'Snap';
		return;
	}
	
	var fullPath = document.getElementById('fileinput').value;
	if (fullPath) {
		var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		var filename = fullPath.substring(startIndex);
		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
		}
		//get rid of the file extension
		file_name = filename.replace(/\.[^/.]+$/, "");
	}
	
	file = selectedFile;
	reader.readAsText(file);
}

function usage() {
	alert('Select an XML file containing a Snap! project!');
}

function startLoadingAnimation() {
	//start spinner
	spinner.spin(spinnerTarget);
	
	//lock GUI
	var allChildNodes = document.getElementById("gui").getElementsByTagName('*');
	for (var i = 0; i < allChildNodes.length; i++) {
		allChildNodes[i].disabled = true;
		//make everything look disabled
		allChildNodes[i].style.color = '#aaa';
		//spinning cursor
		allChildNodes[i].style.cursor = 'wait';
	}
	
	var sendButton = document.getElementById('sendButton');
	sendButton.disabled = true;
	sendButton.style.cursor = 'wait';
	
	var separator = document.getElementById('guiSeparator');
	separator.style.backgroundColor = '#aaa';
	
	document.body.style.cursor = 'wait';
}

function endLoadingAnimation() {
	//stop spinner
	spinner.stop();
	
	//unlock GUI
	var allChildNodes = document.getElementById("gui").getElementsByTagName('*');
	for (var i = 0; i < allChildNodes.length; i++) {
		allChildNodes[i].disabled = false;
		allChildNodes[i].style.color = 'black';
		allChildNodes[i].style.cursor = '';
	}
	var sendButton = document.getElementById('sendButton');
	sendButton.disabled = false;
	sendButton.style.cursor = '';
	
	var separator = document.getElementById('guiSeparator');
	separator.style.backgroundColor = 'black';
	
	document.body.style.cursor = 'auto';
}

function uploadFile() {
	startLoadingAnimation();
	
	var HTTPRequest = new XMLHttpRequest();
	HTTPRequest.responseType = 'arraybuffer'; //we're reading binary data over here
		
	HTTPRequest.onerror = function () {
		endLoadingAnimation();
		alert('Whoops! There\'s been a problem connecting to the server :(\nTry again later!');
	};
	
	HTTPRequest.onload = function () {
		endLoadingAnimation();
		
		if (this.status === 500) {
			alert('Sorry, something went wrong server-side :(\nTry again later!');
			return;
		}
		
		if (this.status === 200) {
			var filename = "";
			var disposition = HTTPRequest.getResponseHeader('Content-Disposition');
			if (disposition && disposition.indexOf('attachment') !== -1) {
				var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
				var matches = filenameRegex.exec(disposition);
				if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
			}
			var type = HTTPRequest.getResponseHeader('Content-Type');
			var blob = new Blob([this.response], {type: type});
			if (typeof window.navigator.msSaveBlob !== 'undefined') {
				// IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
				window.navigator.msSaveBlob(blob, filename);
			} else {
				var URL = window.URL || window.webkitURL;
				var downloadUrl = URL.createObjectURL(blob);

				if (filename) {
					// use HTML5 a[download] attribute to specify filename
					var a = document.createElement("a");
					// safari doesn't support this yet
					if (typeof a.download === 'undefined') {
						window.location = downloadUrl;
					} else {
						a.href = downloadUrl;
						a.download = filename;
						document.body.appendChild(a);
						a.click();
					}
				} else {
					window.location = downloadUrl;
				}

				setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
			}
		}
	};
	
	try {
		var fd = new FormData();
		fd.append('file_name', file_name);
		fd.append('file_contents', SnapProject);
		var osSelector = document.getElementById("osSelector");
		fd.append('target_os', osSelector.options[osSelector.selectedIndex].value);
		var resolutionSelector = document.getElementById("resolutionSelector");
		fd.append('resolution', resolutionSelector.options[resolutionSelector.selectedIndex].value);
		var appStyleRadio = document.getElementById('completeAppRadio');
		if (appStyleRadio.checked) fd.append('complete_snap', 'use');
		HTTPRequest.open('POST', url, true);
		HTTPRequest.send(fd);
	} catch (err) {
		console.log(err);
	}
}