const path = require('path');
const rootDir = path.resolve(__dirname, '..');

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [rootDir].concat(args));
}

module.exports = {
    root
};
