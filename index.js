'use strict';

var babbot = require('./babbot.js');

var processParameters = process.argv.slice(1),
    targetPlatform;

if (processParameters.indexOf('-c') !== -1) {
    targetPlatform = require('./platforms/console.js');
} else {
    targetPlatform = require('./platforms/telegram.js');
}

var platformInstance = new targetPlatform(new babbot());
