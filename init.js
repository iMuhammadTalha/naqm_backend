const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const responseTime = require('response-time');
const passport = require('passport');

//server initialization function from ./initServer.js
const initServer = require(path.join(__dirname, 'initServer'));

module.exports.init = async function init() {
    try {
        const app = express();
        app.use('/images', express.static('images'));

        //the custom userObject, that is shared over the application via the require cache.
        require.cache.userObject = {
            app
        };

        //the base __dirname
        require.cache.userObject.appPath = __dirname;

        app.use(compression());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true,
        }));
        app.use(cookieParser());
        app.use(helmet());
        const cors = function (req, res, next) {
            const whitelist = ['localhost:3000', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', '111.68.101.14:3000', 'http://111.68.101.14:3001', 'http://111.68.101.14'];
            // , 'http://13.59.81.136:3000', 'http://13.59.81.136', '13.59.81.136:3000', '13.59.81.136:3355', 'http://3.17.188.155:3000', 'http://3.17.188.155', '3.17.188.155:3000', '3.17.188.155:3355', '54.159.89.13', 'http://54.159.89.13', 'http://54.159.89.13:3000', 'http://54.159.89.13:3355', '54.159.89.13', '54.159.89.13:3000', '54.159.89.13:3355'
            const origin = req.headers.origin;
            const host = req.headers.host;
            if (whitelist.indexOf(origin) > -1 || whitelist.indexOf(host) > -1) {
                if (origin) {
                    res.setHeader('Access-Control-Allow-Origin', origin);
                } else {
                    res.setHeader('Access-Control-Allow-Origin', host);
                }
            } else {
                if (origin) {
                    logger.info('Not Allowed', req.headers.origin);
                } else {
                    logger.info('Not Allowed', req.headers.host);
                }
                return res.status(400).send('Not Allowed...');
            }
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
            next();
        };
        app.use(cors);     // cors()
        app.use(responseTime());

        //initializing config and getting the config object
        const config = require(path.join(__dirname, '/config/index.js'));

        //initializing errorObject
        const errorObject = require(path.join(__dirname, '/config/error.js'));
        require.cache.userObject.errorObject = errorObject;

        //initizing the server, with config and app.
        let {io, server} = await initServer(config, app) || {};

        //passing the socketObject to the userObject
        //require.cache.userObject.io = io;

        //loading the base application router.
        const appRouter = require(path.join(__dirname, '/routes.js'))(io);

        //initialzing the logger with the module name.
        const logger = config.logger.createLogger('init');

        // Router mounting
        app.use('/', appRouter);

        // Passport middleware
        app.use(passport.initialize());
        // Passport Config
        require('./config/passport-jwt')(passport);


        //server object
        server.listen(config.app.server.port)
            .on('error', error => logger.error(error))
            .on('listening', () => logger.info(`Express listening on ${config.app.server.port}`));

        //catching uncaught excpetions and terminating the application.
        process.on('uncaughtException', (err) => {
            console.error('whoops! there was an error', errorObject.getError('UNCAUGHT_EXCEPTION', err));
            process.exit(0);
        });

        //database connection check
        var dbcheck = require(path.join(__dirname, '/config/db/dbcheck.js'));
        // logger.info(dbcheck);
        await dbcheck(err => {
            if (err) {
                logger.error(err);
                return process.exit(0);
            }
            logger.info('Database connected successfully...');
            
        });

        var port = 3355;
        /** end Variables */

        /** ExpressJS block */
        // var server1 = app.listen(port, function () {
        //     logger.info(`Socket IO listening at port : ${port}`);
        // });
        // // require('./app/rides/book-ride')(server1);
        // io = require('./lib/socketConnection')(server1, io);
        // app.set('socket', io);


    } catch (error) {
        console.error('Error in initializing', error);
    }
    //init express
};