'use strict';

/* This file will return appropriate config according to env and other variables */
const {join} = require('path');

const configHelper = require(join(__dirname, '/helper'));
const bunyanConfig = require(join(__dirname, '/bunyan.js'));
const appConfig = require(join(__dirname, '/app.json'));

if (process.env.NODE_ENV === 'production') {
    module.exports.logger = bunyanConfig;
    if (!appConfig.production) {
        configHelper.moduleNotConfigured('app-config');
    }

    //exporting config
    module.exports.app = appConfig.production;
} else if (process.env.NODE_ENV === 'test') {
    if (!appConfig.test) {
        configHelper.moduleNotConfigured('app-config');
    }

    module.exports.app = appConfig.test;
} else if (process.env.NODE_ENV === 'beta') {
    if (!appConfig.beta) {
        configHelper.moduleNotConfigured('app-config');
    }

    module.exports.app = appConfig.beta;
} else {
    // If no NODE_ENV configured, then it's considered as Development
    //export bunyan config.
    module.exports.logger = bunyanConfig;

    if (!appConfig.development) {
        //calling the application waring loggers
        configHelper.moduleNotConfigured('app-config');
    }

    //exporting config
    module.exports.app = appConfig.development;
}
