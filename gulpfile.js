/**
* Import uswds-compile
*/
const uswds = require("@uswds/compile");

/**
* USWDS version
* Set the major version of USWDS you're using
* (Current options are the numbers 2 or 3)
*/
uswds.settings.version = 3;

/**
* Path settings
* Set as many as you need
*/
uswds.paths.dist.css = './public/uswds/css';
uswds.paths.dist.js = './public/uswds/js';
uswds.paths.dist.img = './public/uswds/images';
uswds.paths.dist.fonts = './public/uswds/fonts';

/**
* Exports
* Add as many as you need
*/
exports.init = uswds.init;
exports.compile = uswds.compile;
exports.watch = uswds.watch;
exports.update = uswds.updateUswds;
exports.default = uswds.watch;
