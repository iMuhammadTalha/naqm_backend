module.exports = function (io) { // catch here

    const path = require('path');
    const config = require(path.join(__dirname, '/config/index.js'));
    const logger = config.logger.createLogger('routes');
    const router = require('express').Router();
    const errorObject = require.cache.userObject.errorObject;
    const moment = require('moment');
    const passport = require('passport');
    

//prining the details of any requests being made to the application.
    router.use('/', (req, res, next) => {
        logger.debug(`TIME: ${moment(new Date()).format('YYYY-MM-DD hh:mm:ss')} METHOD: ${req.method} URL: ${req.url}`);
        res.io = io;

        if(process.env.IS_MAINTENANCE=='true'){
            logger.info('Under maintenance:', process.env.IS_MAINTENANCE);
            return res.status(503).json({msg: 'Sorry! System is under maintenance. Please try again later.'});
        } else{
            next();
        }
    });

//attaching other routes to the base router.
    router.use('/air', require(path.join(__dirname, '/app/airReadings/routes.js')));

    router.use('/user', require(path.join(__dirname, '/app/user/routes.js')));
    

//not found
    router.use('/', (req, res) => {
        const errObj = errorObject.getError('PAGE_NOT_FOUND');
        res.statusCode = errObj.status;
        res.json(errObj.errorMessage);
    });

//error
    router.use('/', (err, req, res) => {
        const errObj = errorObject.getError('SERVER_ERROR');
        res.statusCode = errObj.status;
        res.json(errObj.errorMessage);

        logger.error(err);
    });

    return router;
};
