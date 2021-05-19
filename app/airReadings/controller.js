const moment = require('moment');
const services = require('./services');
const config = require('../../config');
const logger = config.logger.createLogger('AirReadings/controller');

exports.getAllAirReadings = function (req, res, next) {
    services.getAllAirReading(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading'});
        }

        res.locals.allAirReadings = rows;
        next();
    });
};

exports.getAllAirReadingsWithPagination = function (req, res, next) {
    services.getAllAirReadingWithPagination(req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading'});
        }
        res.locals.allAirReadings = rows;
        next();
    });
};

exports.getAllAirReadingsByNode = function (req, res, next) {
    services.getAllAirReadingByNode(req.params.id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading by service'});
        }

        res.locals.allAirReadings = rows;
        next();
    });
};

exports.createAirReading = function (req, res, next) {

    const AirReading = {
        ch4: req.body.ch4, 
        co: req.body.co, 
        dust: req.body.dust, 
        humidity: req.body.humidity, 
        latitude: req.body.latitude, 
        longitude: req.body.longitude, 
        nh3: req.body.nh3, 
        no2: req.body.no2, 
        node_id: req.body.node_id, 
        co2: req.body.co2,
        temperature: req.body.temperature,
        created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    };

    services.createAirReading(AirReading, function (err, AirReading) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in create AirReading'});
        }
        if (AirReading === 1) {
            res.status(200).send({msg: 'AirReading Created'});
        } else {
            res.status(200).send({msg: 'AirReading not Created'});
        }
        next();
    });

};

exports.deleteAirReading = function (req, res, next) {
    services.deleteAirReading(req.params.id, function (err, affectedRows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in delete AirReading'});
        }
        if (affectedRows === 0) {
            res.locals.Msg = {msg: 'No AirReading found with the given id'};
        } else {
            res.locals.Msg = {msg: 'AirReading Deleted'};
        }
        next();
    });
};

