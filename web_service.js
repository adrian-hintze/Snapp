//application port
var PORT = 80;

//import modules
var express = require('express');
var path = require('path');
var multiparty = require('multiparty');
var fs = require('fs');
var os = require("os");
var archiver = require('archiver');
var toArray = require('stream-to-array');
var libxmljs = require('libxmljs');

//verbosity
var verbose = true;

//keep constant files in memory to make requests faster
var win64exe = fs.readFileSync(path.join(__dirname, 'nw', 'win64', 'exe', 'nw.exe'));
var win32exe = fs.readFileSync(path.join(__dirname, 'nw', 'win32', 'exe', 'nw.exe'));
var lin64exe = fs.readFileSync(path.join(__dirname, 'nw', 'lin64', 'bin', 'nw'));
var lin32exe = fs.readFileSync(path.join(__dirname, 'nw', 'lin32', 'bin', 'nw'));

var desktop = fs.readFileSync(path.join(__dirname, 'conf', 'linux', 'desktop', 'app.desktop')).toString();
var launcher = fs.readFileSync(path.join(__dirname, 'conf', 'linux', 'launchScript', 'launcher.sh')).toString();

var plist64 = fs.readFileSync(path.join(__dirname, 'conf', 'mac64', 'Info.plist')).toString();
var plist32 = fs.readFileSync(path.join(__dirname, 'conf', 'mac32', 'Info.plist')).toString();

var reducedFiles = [];
fs.readdirSync(path.join(__dirname, 'working', 'result')).forEach(
	function (file) {
		if (file === 'gui.js') return;
		var file_path = path.join(__dirname, 'working', 'result', file);
		var fileInfo = {name: file, file: fs.readFileSync(file_path)};
		reducedFiles.push(fileInfo);
	}
)

var completeFiles = [];
fs.readdirSync(path.join(__dirname, 'working', 'packageSnap')).forEach(
	function (file) {
		if (file === 'gui.js') return;
		var file_path = path.join(__dirname, 'working', 'packageSnap', file);
		var fileInfo = {name: file, file: fs.readFileSync(file_path)};
		completeFiles.push(fileInfo);
	}
)

//mac workaround for system shortcuts
var macWorkaroundCode = 
"var gui = require('nw.gui');\n" +
"var win = gui.Window.get();\n" +
"var menu = new gui.Menu({ type: 'menubar' });\n" +
"menu.createMacBuiltin(\n" +
"	'<project_name>',\n" +
"	{\n" +
"		hideEdit: true,\n" +
"		hideWindow: true\n" +
"	}\n" +
");\n" +
"win.menu = menu;\n" +
"var close = {\n" +
"    key : 'Ctrl+q',\n" +
"    active : function() {\n" +
"        win.close();\n" +
"    }\n" +
"};\n" +
"var closeWindow = {\n" +
"    key : 'Ctrl+w',\n" +
"    active : function() {\n" +
"        win.close();\n" +
"    }\n" +
"};\n" +
"var minimize = {\n" +
"    key : 'Ctrl+m',\n" +
"    active : function() {\n" +
"        win.minimize();\n" +
"    }\n" +
"};\n" +
"var closeShortcut = new gui.Shortcut(close);\n" +
"var closeWindowShortcut = new gui.Shortcut(closeWindow);\n" +
"var minimizeShortcut = new gui.Shortcut(minimize);\n" +
"gui.App.registerGlobalHotKey(closeShortcut);\n" +
"gui.App.registerGlobalHotKey(closeWindowShortcut);\n" +
"gui.App.registerGlobalHotKey(minimizeShortcut);\n" +
"win.on(\n" +
"	'focus',\n" +
"	function() {\n" +
"		gui.App.registerGlobalHotKey(closeShortcut);\n" +
"		gui.App.registerGlobalHotKey(closeWindowShortcut);\n" +
"		gui.App.registerGlobalHotKey(minimizeShortcut);\n" +
"	}\n" +
");\n" +
"win.on(\n" +
"	'blur',\n" +
"	function() {\n" +
"		gui.App.unregisterGlobalHotKey(closeShortcut);\n" +
"		gui.App.unregisterGlobalHotKey(closeWindowShortcut);\n" +
"		gui.App.unregisterGlobalHotKey(minimizeShortcut);\n" +
"	}\n" +
");\n";

//avoid server crashes
process.on(
	'uncaughtException',
	function (err) {
		console.log('uncaughtException: ' + err);
	}
);

//start webserver
console.log('starting server');
var web_server = express();

web_server.use(
	function(request, response, next) {
		if (!request.get('Origin')) return next();

		response.set('Access-Control-Allow-Origin', '*');
		response.set('Access-Control-Allow-Methods', 'GET,POST');
		response.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

		if ('OPTIONS' == request.method) return response.send(200);
		next();
	}
);

web_server.use(express.static(path.join(__dirname, 'web', 'index')));

//standard get returns the static web page
web_server.get(
	'/', 
	function(request, response) {
		response.sendFile(path.join(__dirname, 'web', 'index', 'index.html'));
	}
);

function endResponseWithError(response) {
	response.set("Connection", "close");
	response.status(500).send('500 Internal Server Error');
}

function log(message) {
	if (verbose) {
		console.log(message);
	}
}

function logIndent(message) {
	if (verbose) {
		console.log('    ' + message);
	}
}

function fn2sfn(name) {
	if (name.length < 16) return name;
	else return 'Snapp!';
}

function buildPackageJson(os, projectName, width, height) {
	var nodejs = '"nodejs": false,';
	if (os === 'mac32' || os === 'mac64') nodejs = '"nodejs": true,';
	var packageContents = '{' +
							'"name": "snapapp",' +
							'"main": "snap.html",' +
							nodejs +
							'"single-instance": true,' +
							'"window": {' +
								'"icon": "lambda.png",' +
								'"title": "' + projectName + '",' +
								'"toolbar": false,' +
								'"resizable": true,' +
								'"width": ' + width + ',' +
								'"height": ' + height +
							'}' +
						'}';
	return packageContents;
}

function buildGUI(os, snapProject, projectName) {
	var result = '\n';
	if (os === 'mac32' || os === 'mac64') {
		result += macWorkaroundCode.replace('<project_name>', projectName) + '\n';
	}
	result += "IDE_Morph.prototype.snapproject = '" + snapProject + "';"
	return result;
}

//handle post petiton to create an executable file
web_server.post(
	'/gen_exec',
	function(request, response) {
		var form = new multiparty.Form({maxFieldsSize: '15MB'});
		form.parse(
			request, 
			function(err, fields, files) {
				try {
					log('start post');
					
					//check errors in the form
					if (err) {
						console.log(err);
						throw 'form error';
					}
					
					//validate form fields
					if (!fields || !fields['file_name'] || !fields['file_contents'] || !fields['target_os'] || !fields['resolution']) {
						throw 'fields error';
					}
					
					//user preferences
					var file_name = fields['file_name'][0];
					var file_contents = fields['file_contents'][0];
					var width = fields['resolution'][0].split('x')[0];
					var height = fields['resolution'][0].split('x')[1];
					var target_os = fields['target_os'][0];
					var complete_snap = fields['complete_snap'] ? true : false;
					logIndent('validations completed');
					
					//validate xml
					try {
						var xmlProject = libxmljs.parseXml(file_contents);
					} catch (err) {
						console.log(err);
						throw 'xml validation error';
					}
					logIndent('xml validated');
					
					//technically every snap project has a project tag with a name attribute
					if (!xmlProject.get('//project') || !xmlProject.get('//project').attr('name')) {
						throw 'nonexistent name attr error';
					}
					
					//get project name
					var projectName = xmlProject.get('//project').attr('name').value();
					
					//init depending on the user's os
					var selectedExecutable;
					var osNWFiles;
					var snappFolderName = file_name + '.snapp';
					switch (target_os) {
						case 'mac64':
							osNWFiles = 'mac64';
							break;
						case 'mac32':
							osNWFiles = 'mac32';
							break;
						case 'lin64':
							selectedExecutable = lin64exe;
							osNWFiles = 'lin64';
							break;
						case 'lin32':
							selectedExecutable = lin32exe;
							osNWFiles = 'lin32';
							break;
						case 'win32':
							selectedExecutable = win32exe;
							osNWFiles = 'win32';
							break;	
						case 'win64':
						default:
							selectedExecutable = win64exe;
							osNWFiles = 'win64';
							break;
					}
					logIndent('user preferences obtained');
					
					//zips and their corresponding callbacks
					var zippedNWPackage = archiver('zip', {});
					
					function finalizeNWPackage() {
						logIndent('finalizeNWPackage finalized');
						toArray(
							zippedNWPackage,
							function (err, arr) {
								logIndent('zippedNWPackage toArray complete');
								if (err) {
									console.log(err);
									endResponseWithError(response);
									throw 'toArray error';
								}
								else {
									//add binary
									var buffer = Buffer.concat(arr);
									switch (target_os) {
										case 'mac64':
										case 'mac32':
											zippedResult.append(buffer, {name: path.join(file_name + '.app', 'Contents', 'Resources', 'app.nw'), mode: 0755});
											break;
										case 'lin64':
										case 'lin32':
											buffer = Buffer.concat([selectedExecutable, buffer]);
											zippedResult.append(buffer, {name: path.join(snappFolderName, file_name), mode: 0755});
											break;
										case 'win64':
										case 'win32':
										default:
											buffer = Buffer.concat([selectedExecutable, buffer]);
											zippedResult.append(buffer, {name: path.join(file_name, file_name + '.exe')});
											break;
									}
									zippedResult.finalize();
									log('post completed');
								}
							}
						);
					}
					
					zippedNWPackage.on(
						'error',
						function(err) {
							console.log(err);
							endResponseWithError(response);
							throw 'zipNWPackage error';
						}
					);
					
					zippedNWPackage.on(
						'finish',
						finalizeNWPackage
					);
					logIndent('zippedNWPackage created');
					
					var zippedResult = archiver('zip', {});
					
					//add libraries
					switch (target_os) {
						case 'mac64':
							zippedResult.directory(path.join(__dirname, 'nw', osNWFiles), file_name + '.app');
							var newplist = plist64.replace('<file_name>', file_name);
							newplist = newplist.replace('<short_file_name>', fn2sfn(file_name));
							zippedResult.append(newplist, {name: path.join(file_name + '.app', 'Contents', 'Info.plist')});
							break;
						case 'mac32':
							zippedResult.directory(path.join(__dirname, 'nw', osNWFiles), file_name + '.app');
							var newplist = plist32.replace('<file_name>', file_name);
							newplist = newplist.replace('<short_file_name>', fn2sfn(file_name));
							zippedResult.append(newplist, {name: path.join(file_name + '.app', 'Contents', 'Info.plist')});
							break;
						case 'lin64':
						case 'lin32':
							zippedResult.directory(path.join(__dirname, 'nw', osNWFiles, 'lib'), snappFolderName);
							//add launcher script
							zippedResult.append(launcher.replace('<file_name>', file_name), {name: path.join(snappFolderName, 'launcher.sh'), mode: 0755});
							//add desktop file
							var localDesktop = desktop.replace('<file_name>', file_name) + file_name;
							zippedResult.append(localDesktop, {name: file_name + '.desktop', mode: 0755});
							//add icon
							zippedResult.append(fs.createReadStream(path.join(__dirname, 'appIcon', 'lambda.png')), {name: path.join(snappFolderName, 'lambda.png')});
							break;
						case 'win64':
						case 'win32':
						default:
							zippedResult.directory(path.join(__dirname, 'nw', osNWFiles, 'dll'), file_name);
							break;
					}
					
					zippedResult.on(
						'error',
						function(err) {
							console.log(err);
							endResponseWithError(response);
							throw 'zipResult error';
						}
					);
					logIndent('zippedResult created');
					
					//set attachment
					response.attachment(file_name + '.zip');
					zippedResult.pipe(response);
					logIndent('attachment set');
					
					//add package.json 
					var packageContents = buildPackageJson(target_os, projectName, width, height);
					zippedNWPackage.append(packageContents, {name: 'package.json'});
					logIndent('package created');
					
					//add snap icon
					switch (target_os) {
						case 'mac64':
						case 'mac32':
							zippedResult.append(fs.createReadStream(path.join(__dirname, 'appIcon', 'lambda.icns')), {name: path.join(file_name + '.app', 'Contents', 'Resources', 'nw.icns')});
							break;
						default:
							break;
					}
					zippedNWPackage.append(fs.createReadStream(path.join(__dirname, 'appIcon', 'lambda.png')), {name: 'lambda.png'});
					logIndent('icon added');
					
					//compress de snap app
					
					//use Snap instead of the reduced execution environment
					if (complete_snap) {
						var file_path = path.join(__dirname, 'working', 'packageSnap', 'gui.js');
						fs.readFile(
							file_path,
							function (err, data) {
								if (err) {
									console.log(err);
									endResponseWithError(response);
									throw 'read gui complete error';
								}
								
								var contents = data + buildGUI(target_os, file_contents, projectName);
								//BUG: if file_contents is too big archiver will hang
								//eventually the browser just receives an error
								zippedNWPackage.append(contents, {name: 'gui.js'});
								logIndent('complete gui added');
									
								completeFiles.forEach(
									function (fileInfo) {
										zippedNWPackage.append(fileInfo.file, {name: fileInfo.name});
									}
								)
								logIndent('complete dir added');
								zippedNWPackage.finalize();
							}
						);
					}
					else {
						var file_path = path.join(__dirname, 'working', 'result', 'gui.js');
						fs.readFile(
							file_path,
							function (err, data) {
								if (err) {
									console.log(err);
									endResponseWithError(response);
									throw 'read gui reduced snap error';
								}
								
								var contents = data + buildGUI(target_os, file_contents, projectName);
								//BUG: if file_contents is too big archiver will hang
								//eventually the browser just receives an error
								zippedNWPackage.append(contents, {name: 'gui.js'});
								logIndent('reduced gui added');
									
								reducedFiles.forEach(
									function (fileInfo) {
										zippedNWPackage.append(fileInfo.file, {name: fileInfo.name});
									}
								)
								logIndent('reduced dir added');
								zippedNWPackage.finalize();
							}
						);
					}
				} catch (err) {
					console.log(err);
					endResponseWithError(response);
					return;
				}
			}
		);
	}
);

//404
//TODO make a nicer 404 page
web_server.all(
	'*',
	function(request, response){
		response.status(404).send('404 Not found');
	}
);

web_server.listen(PORT);
console.log('listening on port ' + PORT);