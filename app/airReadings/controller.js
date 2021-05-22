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

exports.getANodeAllAirReadingsWithPagination = function (req, res, next) {
    services.getANodeAllAirReadingsWithPagination(req.params.id, req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
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

exports.getAQI = function (req, res, next) {
    res.locals.aqi = {aqi: 0};

    const nh3Index = [200, 400, 800, 1200, 1800];
    const coIndex = [4.4, 9.4, 12.4, 15.4, 30.4, 40.4];
    const no2Index = [0.053, 0.1, 0.36, 0.65, 1.24, 1.64];
    const ch4Index = [50, 100, 150, 200, 300, 400];
    const co2Index = [1000, 2000, 5000, 10000, 20000, 40000];
    const dustIndex = [12, 35.4, 150.4, 250.4, 350.4];
    const ranges = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500]];
    
    services.getALatestAirReading(req.params.id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading'});
        }
        let AirReading = rows[0];
        
        logger.info('RECORDS',AirReading);
    
    const no2AQI = this.calculateForReading(AirReading.no2, no2Index);
    const dustAQI = this.calculateForReading(AirReading.dust, dustIndex);
    const nh3AQI = this.calculateForReading(AirReading.nh3, nh3Index);
    const co2AQI = this.calculateForReading(AirReading.co2, co2Index);
    const coAQI = this.calculateForReading(AirReading.co, coIndex);
    const ch4AQI = this.calculateForReading(AirReading.ch4, ch4Index);

    let AQI=Math.round(this.calculateAQIAverage([
        dustAQI, nh3AQI, co2AQI, coAQI, no2AQI, ch4AQI
      ]));

    logger.info(AQI);
    res.locals.aqi.aqi = AQI+10;
        next();
    });
     
};


calculateForReading = function (reading, range) {
    const ranges = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500]];

    for (let counter = 0; counter < range.length; counter++) {
        if (reading <= range[counter] || counter === range.length - 1) {
          const [iHi, iLo] = ranges[counter];
          return this.calculateAQI(iHi, iLo, range[counter], counter === 0 ? 0 : range[counter - 1],
            counter === range.length - 1 ? range[counter] : reading);
        }
    }
}

calculateAQI = function(iHi, iLo, bpHi, bpLo, cP) {
    return Math.round((((iHi - iLo) / (bpHi - bpLo)) * (cP - bpLo)) + iLo);
}

calculateAQIAverage= function(AQIs) {
    let sum = 0;
    for (const aqi of AQIs) {
      sum += aqi;
    }
    return sum / AQIs.length;
  }

  exports.getARecentReading = function (req, res, next) {

    services.getALatestAirReading(req.params.id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading'});
        }

    res.locals.aAirReading = rows[0];
    next();
    });
    
};