# Snapp

Snapp*!* turns [Snap*!*](http://snap.berkeley.edu/) projects into standalone executables! 

## Demo

Try it at [http://snapp.citilab.eu/](http://snapp.citilab.eu/)

## Usage

1. Intall [Node.js](https://nodejs.org/en/) and the corresponding [modules](https://github.com/Rydion/Snapp/blob/master/README.md#nodejs-modules).

2. Copy every Snapp*!* file into whatever folder you like (if necessary remeber to link every Node.js module).

3. Go to **'/web/index/js/index.js'** and change line **2** to point to your own server.

5. Execute Snapp*!* from the commnad line like this **'node /PATH_TO_SNAPP_FOLDER/web_service.js'**

6. Now just access Snapp*!* from your browser!

## Node.js Modules

Snapp*!* requires the following Node.js modules:

- [express](https://www.npmjs.com/package/express)
- [multiparty](https://www.npmjs.com/package/multiparty)
- [archiver](https://www.npmjs.com/package/archiver)
- [stream-to-array](https://www.npmjs.com/package/stream-to-array)
- [libxmljs](https://www.npmjs.com/package/libxmljs)

To create the executables NW.js binaries are used:

- [Nw.js](http://nwjs.io/)
