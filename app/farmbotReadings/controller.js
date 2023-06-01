const moment = require('moment');
const services = require('./services');
const config = require('../../config');
const logger = config.logger.createLogger('FarmBotReadings/controller');


exports.getAllFarmBotReadings = function (req, res, next) {
    services.getAllFarmBotReading(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all FarmBotReading'});
        }

        res.locals.allFarmBotReadings = rows;
        next();
    });
};

exports.getAllFarmBotReadingsWithPagination = function (req, res, next) {
    services.getAllFarmBotReadingWithPagination(req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all FarmBotReading'});
        }
        res.locals.allFarmBotReadings = rows;
        next();
    });
};

exports.getANodeAllFarmBotReadingsWithPagination = function (req, res, next) {
    services.getANodeAllFarmBotReadingsWithPagination(req.params.id, req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all FarmBotReading'});
        }
        res.locals.allFarmBotReadings = rows;
        next();
    });
};

exports.getAllFarmBotReadingsByFarmBot = function (req, res, next) {
    services.getAllFarmBotReadingByFarmBot(req.params.id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all FarmBotReading by node'});
        }

        res.locals.allFarmBotReadings = rows;
        next();
    });
};

exports.createFarmBotReading = function (req, res, next) {

    const FarmBotReading = {
        nitrogen: req.body.nitrogen, 
        phosphorus: req.body.phosphorus, 
        potassium: req.body.potassium, 
        soil_moisture: req.body.soil_moisture, 
        node_id: req.body.node_id,
        created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    };

    services.createFarmBotReading(FarmBotReading, function (err, FarmBotReading) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in create FarmBotReading'});
        }
        if (FarmBotReading === 1) {
            res.status(200).send({msg: 'FarmBotReading Created'});
        } else {
            res.status(200).send({msg: 'FarmBotReading not Created'});
        }
        next();
    });

};

exports.deleteFarmBotReading = function (req, res, next) {
    services.deleteFarmBotReading(req.params.id, function (err, affectedRows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in delete FarmBotReading'});
        }
        if (affectedRows === 0) {
            res.locals.Msg = {msg: 'No FarmBotReading found with the given id'};
        } else {
            res.locals.Msg = {msg: 'FarmBotReading Deleted'};
        }
        next();
    });
};

exports.getGraph = function (req, res, next) {
    res.locals.GraphData = {
        nitrogenAvg: [0],
        phosphorusAvg: [0],
        potassiumAvg: [0],
        soilMoistureAvg: [0],
        dates: []
    };

    let nitrogenAvg = [];
    let phosphorusAvg = [];
    let potassiumAvg = [];
    let soilMoistureAvg = [];
    let dates = [];

    services.get10lastdates(req.params.id, async function (err, last10dates) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading'});
        }

        for(let i=last10dates.length-1; i>=0; i--){
            let dayAvg=await services.getAvgValuesdatesAsync(req.params.id, i);//, function (err, dayAvg) {

            nitrogenAvg[i]=dayAvg.body_temperature;
            phosphorusAvg[i]=dayAvg.atmospheric_temperature;
            potassiumAvg[i]=dayAvg.atmospheric_humidity;
            soilMoistureAvg[i]=dayAvg.beat_per_min;

                dates[i]= moment(new Date()).subtract(i, "days").format('YYYY-MM-DD');
        
        }
        
                res.locals.GraphData.nitrogenAvg = nitrogenAvg;
                res.locals.GraphData.phosphorusAvg = phosphorusAvg;
                res.locals.GraphData.potassiumAvg = potassiumAvg;
                res.locals.GraphData.soilMoistureAvg = soilMoistureAvg;
                res.locals.GraphData.dates = dates;
        
                next();
    });

};