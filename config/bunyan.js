'use strict';

const bunyan = require('bunyan');
const bunyanFormat = require('bunyan-format');
const path = require('path');

const appRootDir = path.dirname(require.main.filename);
const configHelper = require(path.join(__dirname, '/helper'));

if (process.env.NODE_ENV === 'production') {
    //Declaring output mode.
    // eslint-disable-next-line no-unused-vars
    const formatOut = bunyanFormat({
        outputMode: 'short'
    });

    //creating bunyan logging
    module.exports.createLogger = function createLogger(name) {
        return bunyan.createLogger({
            name,
            serializers: bunyan.stdSerializers,
            streams: [
                {
                    level: 'error',
                    path: `${appRootDir}/logs/error.production.log`
                },
                {
                    level: 'warn',
                    stream: formatOut
                }
            ]
        });
    };
} else if (process.env.NODE_ENV === 'test') {
    configHelper.moduleNotConfigured('bunyan');
} else if (process.env.NODE_ENV === 'beta') {
    configHelper.moduleNotConfigured('bunyan');
} else {
    // If no NODE_ENV configured, then it's considered as Development
    //Declaring output mode.
    const formatOut = bunyanFormat({
        outputMode: 'short'
    });

    //creating bunyan logging
    module.exports.createLogger = function createLogger(name) {
        return bunyan.createLogger({
            name,
            serializers: bunyan.stdSerializers,
            streams: [
                {
                    level: 'debug',
                    stream: formatOut
                },
                {
                    level: 'error',
                    stream: formatOut,
                    path: `${appRootDir}/logs/error.development.log`
                }
            ]
        });
    };

}
