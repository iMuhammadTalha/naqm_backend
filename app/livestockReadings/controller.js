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

exports.getGraph = function (req, res, next) {
    res.locals.GraphData = {
        bodyTemperatureAvg: [0],
        atmosphericTemperatureAvg: [0],
        atmosphericHumidityAvg: [0],
        beatPerMinAvg: [0],
        axAvg: [0],
        ayAvg: [0],
        azAvg: [0],
        gxAvg: [0],
        gyAvg: [0],
        gzAvg: [0],
        dates: []
    };

    let bodyTemperatureAvg = [];
    let atmosphericTemperatureAvg = [];
    let atmosphericHumidityAvg = [];
    let beatPerMinAvg = [];
    let axAvg = [];
    let ayAvg = [];
    let azAvg = [];
    let gxAvg = [];
    let gyAvg = [];
    let gzAvg = [];
    let dates = [];

    services.get10lastdates(req.params.id, async function (err, last10dates) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading'});
        }

        for(let i=last10dates.length-1; i>=0; i--){
            let dayAvg=await services.getAvgValuesdatesAsync(last10dates[i].created_time);//, function (err, dayAvg) {

                bodyTemperatureAvg[i]=dayAvg.body_temperature;
                atmosphericTemperatureAvg[i]=dayAvg.atmospheric_temperature;
                atmosphericHumidityAvg[i]=dayAvg.atmospheric_humidity;
                beatPerMinAvg[i]=dayAvg.beat_per_min;
                axAvg[i]=dayAvg.ax;
                ayAvg[i]=dayAvg.ay;
                azAvg[i]=dayAvg.az;
                gxAvg[i]=dayAvg.gx;
                gyAvg[i]=dayAvg.gy;
                gzAvg[i]=dayAvg.gz;

                dates[i]= last10dates[i].created_time;
        
        }
        
                res.locals.GraphData.bodyTemperatureAvg = bodyTemperatureAvg;
                res.locals.GraphData.atmosphericTemperatureAvg = atmosphericTemperatureAvg;
                res.locals.GraphData.atmosphericHumidityAvg = atmosphericHumidityAvg;
                res.locals.GraphData.beatPerMinAvg = beatPerMinAvg;
                res.locals.GraphData.axAvg = axAvg;
                res.locals.GraphData.ayAvg = ayAvg;
                res.locals.GraphData.azAvg = azAvg;
                res.locals.GraphData.gxAvg = gxAvg;
                res.locals.GraphData.gyAvg = gyAvg;
                res.locals.GraphData.gzAvg = gzAvg;
                res.locals.GraphData.dates = dates;
        
                next();
    });

};