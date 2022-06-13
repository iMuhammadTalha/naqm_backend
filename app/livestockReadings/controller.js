const moment = require('moment');
const services = require('./services');
const config = require('../../config');
const logger = config.logger.createLogger('AnimalReadings/controller');


exports.getAllAnimalReadings = function (req, res, next) {
    services.getAllAnimalReading(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AnimalReading'});
        }

        res.locals.allAnimalReadings = rows;
        next();
    });
};

exports.getAllAnimalReadingsWithPagination = function (req, res, next) {
    services.getAllAnimalReadingWithPagination(req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AnimalReading'});
        }
        res.locals.allAnimalReadings = rows;
        next();
    });
};

exports.getANodeAllAnimalReadingsWithPagination = function (req, res, next) {
    services.getANodeAllAnimalReadingsWithPagination(req.params.id, req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AnimalReading'});
        }
        res.locals.allAnimalReadings = rows;
        next();
    });
};

exports.getAllAnimalReadingsByAnimal = function (req, res, next) {
    services.getAllAnimalReadingByAnimal(req.params.id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AnimalReading by animal'});
        }

        res.locals.allAnimalReadings = rows;
        next();
    });
};

exports.createAnimalReading = function (req, res, next) {

    const AnimalReading = {
        body_temperature: req.body.body_temperature, 
        atmospheric_temperature: req.body.atmospheric_temperature, 
        atmospheric_humidity: req.body.atmospheric_humidity, 
        beat_per_min: req.body.beat_per_min, 
        ax: req.body.ax, 
        ay: req.body.ay, 
        az: req.body.az, 
        gx: req.body.gx, 
        gy: req.body.gy, 
        gz: req.body.gz,
        animal_id: req.body.animal_id,
        created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    };

    services.createAnimalReading(AnimalReading, function (err, AnimalReading) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in create AnimalReading'});
        }
        if (AnimalReading === 1) {
            res.status(200).send({msg: 'AnimalReading Created'});
        } else {
            res.status(200).send({msg: 'AnimalReading not Created'});
        }
        next();
    });

};

exports.deleteAnimalReading = function (req, res, next) {
    services.deleteAnimalReading(req.params.id, function (err, affectedRows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in delete AnimalReading'});
        }
        if (affectedRows === 0) {
            res.locals.Msg = {msg: 'No AnimalReading found with the given id'};
        } else {
            res.locals.Msg = {msg: 'AnimalReading Deleted'};
        }
        next();
    });
};

