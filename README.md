# Snapp

[Snapp*!*](https://github.com/Rydion/Snapp) turns [Snap*!*](http://snap.berkeley.edu/) projects into standalone executables! 

## Demo

Try it at [http://snapp.citilab.eu/](http://snapp.citilab.eu/)

## About v2.0

This version is a full rewrite of Snapp*!* that tries to address all of the issues that the first version had.

## Goals

* Improve code readability and quality
* Improve error handling
* Reduce complexity by relying more on frameworks and external modules
* Add a logging system

## TODO

* Inform the client about the exact error
* Inform the user about the exact error and how he can correct it
* About dialog
* Some more refactoring
* Drop SnapSubset. Even though SnapSubset has always been at the core of this project, with all the constant changes to Snap*!* and ECMAScript, plus some design flaws, make it impossible for me to keep mantaining it at the rate it would need.

## Requirements

* [Node.js](https://nodejs.org/en/) >= v6.0.0
* npm >= v3.0.0
* [Typings](https://github.com/typings/typings)
* [Typescript](https://github.com/Microsoft/TypeScript) 2.0
* [rimraf](https://github.com/isaacs/rimraf)

## Building

1. Install the latest version of Node.js which in turn will install the latest version of npm.

2. Download the necessary declaration files using typings.

3. Install all dependencies using npm.

4. Build the application by running the following command: **npm run build**

5. Test the application by running the following command: **npm run run**. If everything went well the application should start listening on port 80.

## Installation

After building the application you can just drop the **build** folder anywhere and execute **Snapp.js** using **Node**.
To change the port the application will be listening to edit the **snapp_conf.json** file.

## License 

Snapp!

http://snapp.citilab.eu/

written by Adrian Hintze @Rydion hintze.adrian AT gmail.com

Copyright (C) 2016 by Adrian Hintze

Snapp! is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.
