const moment = require('moment');
const services = require('./services');
const config = require('../../config');
const logger = config.logger.createLogger('AirReadings/controller');
const tf = require('@tensorflow/tfjs');
// require('@tensorflow/tfjs-node');


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



exports.getAQIGraph = function (req, res, next) {
    res.locals.AQIGraphData = {
        nh3Avg: [0],
        coAvg: [0],
        no2Avg: [0],
        ch4Avg: [0],
        co2Avg: [0],
        dustAvg: [0],
        humitidyAvg: [0],
        temperatureAvg: [0],
        dates: [],
        AQIAvg: [0]
    };

    const nh3Index = [200, 400, 800, 1200, 1800];
    const coIndex = [4.4, 9.4, 12.4, 15.4, 30.4, 40.4];
    const no2Index = [0.053, 0.1, 0.36, 0.65, 1.24, 1.64];
    const ch4Index = [50, 100, 150, 200, 300, 400];
    const co2Index = [1000, 2000, 5000, 10000, 20000, 40000];
    const dustIndex = [12, 35.4, 150.4, 250.4, 350.4];
    const ranges = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500]];
    
    let nh3Avg = [];
    let coAvg = [];
    let no2Avg = [];
    let ch4Avg = [];
    let co2Avg = [];
    let dustAvg = [];
    let humitidyAvg = [];
    let temperatureAvg = [];
    let dates = [];

    let AQIAvg = [];

    services.get10lastdates(req.params.id, async function (err, last10dates) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading'});
        }

        for(let i=last10dates.length-1; i>=0; i--){
            let dayAvg=await services.getAvgValuesdatesAsync(last10dates[i].created_time);//, function (err, dayAvg) {

                nh3Avg[i]=dayAvg.nh3;
                coAvg[i]=dayAvg.co;
                no2Avg[i]=dayAvg.no2;
                ch4Avg[i]=dayAvg.ch4;
                co2Avg[i]=dayAvg.co2;
                dustAvg[i]=dayAvg.dust;
                humitidyAvg[i]=dayAvg.humidity;
                temperatureAvg[i]=dayAvg.temperature;
                dates[i]= last10dates[i].created_time;


                const no2AQI = this.calculateForReading(dayAvg.no2, no2Index);
                const dustAQI = this.calculateForReading(dayAvg.dust, dustIndex);
                const nh3AQI = this.calculateForReading(dayAvg.nh3, nh3Index);
                const co2AQI = this.calculateForReading(dayAvg.co2, co2Index);
                const coAQI = this.calculateForReading(dayAvg.co, coIndex);
                const ch4AQI = this.calculateForReading(dayAvg.ch4, ch4Index);

                let AQI=Math.round(this.calculateAQIAverage([
                    dustAQI, nh3AQI, co2AQI, coAQI, no2AQI, ch4AQI
                ]));
                AQIAvg[i]=AQI;
        }
        

                res.locals.AQIGraphData.nh3Avg = nh3Avg;
                res.locals.AQIGraphData.coAvg = coAvg;
                res.locals.AQIGraphData.no2Avg = no2Avg;
                res.locals.AQIGraphData.ch4Avg = ch4Avg;
                res.locals.AQIGraphData.co2Avg = co2Avg;
                res.locals.AQIGraphData.dustAvg = dustAvg;
                res.locals.AQIGraphData.humitidyAvg = humitidyAvg;
                res.locals.AQIGraphData.temperatureAvg = temperatureAvg;
                res.locals.AQIGraphData.dates = dates;
        
                res.locals.AQIGraphData.AQIAvg = AQIAvg;
        
                next();
    });

};



// Temperature, Humidity, Dust
exports.getAQIGraphML = function (req, res, next) {
    res.locals.AQIGraphData = {

        // last10Values : [],
        // nh3Avg: [0],
        // coAvg: [0],
        // no2Avg: [0],
        // ch4Avg: [0],
        // co2Avg: [0],
        dustAvg: [0],
        humitidyAvg: [0],
        temperatureAvg: [0],
        dates: [],
        humitidyAvgPredicted: [0],
        dustAvgPredicted:[0],
        // no2AvgPredicted:[0],
        temperatureAvgPredicted:[0]
        // ,
        // AQIAvg: [0]
    };

    // const nh3Index = [200, 400, 800, 1200, 1800];
    // const coIndex = [4.4, 9.4, 12.4, 15.4, 30.4, 40.4];
    // const no2Index = [0.053, 0.1, 0.36, 0.65, 1.24, 1.64];
    // const ch4Index = [50, 100, 150, 200, 300, 400];
    // const co2Index = [1000, 2000, 5000, 10000, 20000, 40000];
    const dustIndex = [12, 35.4, 150.4, 250.4, 350.4];
    const ranges = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500]];
    
    // let nh3Avg = [];
    // let coAvg = [];
    // let no2Avg = [];
    // let ch4Avg = [];
    // let co2Avg = [];
    let dustAvg = [];
    let humitidyAvg = [];
    let temperatureAvg = [];
    let dates = [];

    // let AQIAvg = [];
    let humitidyAvgPredicted = [];
    let dustAvgPredicted=[]
    // let no2AvgPredicted=[]
    let temperatureAvgPredicted = [];

    let last10Values = [];

    services.get10lastdates(req.params.id, async function (err, last10dates) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading'});
        }

        services.get11lastvalues(req.params.id, async function (err, last10Values) {
            if (err) {
                logger.error(err);
                return res.status(400).send({msg: 'Error in get all AirReading'});
            }
            // logger.error(last10Values);

            // try{

            //     const modelUrlTemperature = 'http://localhost:3001/assets/model/1kvalues/model_temperature/model.json'
            //     const modelTemperature= await tf.loadLayersModel(modelUrlTemperature);
            //     console.log('Temperature ML model loaded succesfully');
                
            //     const modelUrlHumidity = 'http://localhost:3001/assets/model/1kvalues/model_humidity/model.json'            
            //     const modelHumidity= await tf.loadLayersModel(modelUrlHumidity);
            //     console.log('Humidity ML model loaded succesfully');

            //     const modelUrlDust = 'http://localhost:3001/assets/model/1kvalues/model_dust/model.json'
            //     const modelDust= await tf.loadLayersModel(modelUrlDust);
            //     console.log('Dust ML model loaded succesfully');
            
            //     const modelUrlNo2 = 'http://localhost:3001/assets/model/1kvalues/model_no2/model.json'
            //     const modelNo2= await tf.loadLayersModel(modelUrlNo2);
            //     console.log('NO2 ML model loaded succesfully');

            // } catch(error){
            //     logger.error('ERROR', error);
            // }
                for(let i=last10dates.length-1; i>=0; i--){
                    let dayAvg=await services.getAvgValuesdatesAsync(req.params.id, i);//, function (err, dayAvg) {

                        // nh3Avg[i]=dayAvg.nh3;
                        // coAvg[i]=dayAvg.co;
                        // no2Avg[i]=dayAvg.no2;
                        // ch4Avg[i]=parseFloat(dayAvg.ch4);
                        // co2Avg[i]=dayAvg.co2;
                        dustAvg[i]=dayAvg.dust;
                        humitidyAvg[i]=dayAvg.humidity;
                        temperatureAvg[i]=dayAvg.temperature;
                        dates[i]= moment(new Date()).subtract(i, "days").format('YYYY-MM-DD');


                        // const no2AQI = this.calculateForReading(dayAvg.no2, no2Index);
                        const dustAQI = this.calculateForReading(dayAvg.dust, dustIndex);
                        // const nh3AQI = this.calculateForReading(dayAvg.nh3, nh3Index);
                        // const co2AQI = this.calculateForReading(dayAvg.co2, co2Index);
                        // const coAQI = this.calculateForReading(dayAvg.co, coIndex);
                        // const ch4AQI = this.calculateForReading(dayAvg.ch4, ch4Index);

                        // let AQI=Math.round(this.calculateAQIAverage([
                        //     dustAQI, nh3AQI, co2AQI, coAQI, no2AQI, ch4AQI
                        // ]));

                        // AQIAvg[i]=AQI;


                        // res.locals.AQIGraphData.last10Values[i]=parseFloat(last10Values[i].ch4)

                        //Humidity
                        let dayDataHumidity=await services.getHumidityDayValuesAsync(req.params.id, i);     
                        // Get per day 1000 records for predictions

                        let dayDataDust=await services.getDustDayValuesAsync(req.params.id, i);

                        let temperatureDayData=await services.getTemperatureDayValuesAsync(req.params.id, i);
                        
                        

                        try{
                            if(i!=0){

                            
                                // ML Models Predictions
                                const modelUrlHumidity = 'http://localhost:3001/assets/model/1kvalues/model_humidity/model.json'
                                // 1 Value prediction
                                const modelHumidity= await tf.loadLayersModel(modelUrlHumidity);

                                console.log('Humidity ML model loaded succesfully');

                                let predicteds=modelHumidity.predict(tf.reshape(dayDataHumidity.humidity,[-1, 1000, 1]));
                                let predictions = predicteds.dataSync();


                                let predicted_humidity=(-predictions[0]-0)*(Math.max(...dayDataHumidity.humidity)-Math.min(...dayDataHumidity.humidity))+Math.min(...dayDataHumidity.humidity)

                                humitidyAvgPredicted[i]=Math.abs(predicted_humidity);
                            } else if(i==0){
                                humitidyAvgPredicted[i]=dayAvg.humidity;
                            }
                        } catch(error){
                            logger.error('ERROR', error);
                        }


                        try{
                            if(i!=0){
                                // ML Models Predictions
                                const modelUrlDust = 'http://localhost:3001/assets/model/1kvalues/model_dust/model.json'
                                // 1 Value prediction
                                const modelDust= await tf.loadLayersModel(modelUrlDust);
                                // dayDataDust
                                console.log('Dust ML model loaded succesfully');

                                let predicteds=modelDust.predict(tf.reshape(dayDataDust.dust,[-1, 1000, 1]));
                                let predictions = predicteds.dataSync();


                                let predicted_dust=(-predictions[0]-0)*(Math.max(...dayDataDust.dust)-Math.min(...dayDataDust.dust))+Math.min(...dayDataDust.dust)

                                dustAvgPredicted[i]=Math.abs(predicted_dust);
                            } else if(i==0){
                                dustAvgPredicted[i]=dayAvg.dust;
                            }
                        } catch(error){
                            logger.error('ERROR', error);
                        }


                        try{
                            if(i!=0){
                                // ML Models Predictions
                                const modelUrlTemperature = 'http://localhost:3001/assets/model/1kvalues/model_temperature/model.json'
                                // 1 Value prediction
                                const modelTemperature= await tf.loadLayersModel(modelUrlTemperature);

                                console.log('temperature ML model loaded succesfully');

                                let predicteds=modelTemperature.predict(tf.reshape(temperatureDayData.temperature,[-1, 1000, 1]));
                                let predictions = predicteds.dataSync();


                                let predicted_temperature=(-predictions[0]-0)*(Math.max(...temperatureDayData.temperature)-Math.min(...temperatureDayData.temperature))+Math.min(...temperatureDayData.temperature)

                                temperatureAvgPredicted[i]=Math.abs(predicted_temperature);
                            } else if(i==0){
                                temperatureAvgPredicted[i]=dayAvg.temperature;
                            }
                        } catch(error){
                            logger.error('ERROR', error);
                        }
                }
                

                        // res.locals.AQIGraphData.nh3Avg = nh3Avg;
                        // res.locals.AQIGraphData.coAvg = coAvg;
                        // res.locals.AQIGraphData.no2Avg = no2Avg;
                        // res.locals.AQIGraphData.ch4Avg = ch4Avg;
                        // res.locals.AQIGraphData.co2Avg = co2Avg;
                        res.locals.AQIGraphData.dustAvg = dustAvg;
                        res.locals.AQIGraphData.humitidyAvg = humitidyAvg;
                        res.locals.AQIGraphData.temperatureAvg = temperatureAvg;
                        res.locals.AQIGraphData.dates = dates;
                
                        // res.locals.AQIGraphData.AQIAvg = AQIAvg;

                        res.locals.AQIGraphData.humitidyAvgPredicted=humitidyAvgPredicted;
                        res.locals.AQIGraphData.dustAvgPredicted=dustAvgPredicted;
                        
                        res.locals.AQIGraphData.temperatureAvgPredicted=temperatureAvgPredicted;

                        logger.info(res.locals.AQIGraphData)

                        next();

            });
    });

};


// NH3, CO
exports.getAQIGraphML2 = function (req, res, next) {
    res.locals.AQIGraphData = {

        last10Values : [],
        nh3Avg: [0],
        coAvg: [0],
        // no2Avg: [0],
        // ch4Avg: [0],
        // co2Avg: [0],
        // dustAvg: [0],
        // humitidyAvg: [0],
        // temperatureAvg: [0],
        dates: [],
        nh3AvgPredicted: [0],
        coAvgPredicted:[0]
        // ,
        // no2AvgPredicted:[0],
        // temperatureAvgPredicted:[0],
        // AQIAvg: [0]
    };

    const nh3Index = [200, 400, 800, 1200, 1800];
    const coIndex = [4.4, 9.4, 12.4, 15.4, 30.4, 40.4];
    // const no2Index = [0.053, 0.1, 0.36, 0.65, 1.24, 1.64];
    // const ch4Index = [50, 100, 150, 200, 300, 400];
    // const co2Index = [1000, 2000, 5000, 10000, 20000, 40000];
    // const dustIndex = [12, 35.4, 150.4, 250.4, 350.4];
    // const ranges = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500]];
    
    let nh3Avg = [];
    let coAvg = [];
    // let no2Avg = [];
    // let ch4Avg = [];
    // let co2Avg = [];
    // let dustAvg = [];
    // let humitidyAvg = [];
    // let temperatureAvg = [];
    let dates = [];

    // let AQIAvg = [];
    let nh3AvgPredicted = [];
    let coAvgPredicted=[]
    // let no2AvgPredicted=[]
    // let temperatureAvgPredicted = [];

    // let last10Values = [];

    services.get10lastdates(req.params.id, async function (err, last10dates) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading'});
        }

        services.get11lastvalues(req.params.id, async function (err, last10Values) {
            if (err) {
                logger.error(err);
                return res.status(400).send({msg: 'Error in get all AirReading'});
            }
            // logger.error(last10Values);

            // try{

            //     const modelUrlTemperature = 'http://localhost:3001/assets/model/1kvalues/model_temperature/model.json'
            //     const modelTemperature= await tf.loadLayersModel(modelUrlTemperature);
            //     console.log('Temperature ML model loaded succesfully');
                
            //     const modelUrlHumidity = 'http://localhost:3001/assets/model/1kvalues/model_humidity/model.json'            
            //     const modelHumidity= await tf.loadLayersModel(modelUrlHumidity);
            //     console.log('Humidity ML model loaded succesfully');

            //     const modelUrlDust = 'http://localhost:3001/assets/model/1kvalues/model_dust/model.json'
            //     const modelDust= await tf.loadLayersModel(modelUrlDust);
            //     console.log('Dust ML model loaded succesfully');
            
            //     const modelUrlNo2 = 'http://localhost:3001/assets/model/1kvalues/model_no2/model.json'
            //     const modelNo2= await tf.loadLayersModel(modelUrlNo2);
            //     console.log('NO2 ML model loaded succesfully');

            // } catch(error){
            //     logger.error('ERROR', error);
            // }
                for(let i=last10dates.length-1; i>=0; i--){
                    let dayAvg=await services.getAvgValuesdatesAsync(req.params.id, i);//, function (err, dayAvg) {

                        nh3Avg[i]=dayAvg.nh3;
                        coAvg[i]=dayAvg.co;
                        // no2Avg[i]=dayAvg.no2;
                        // ch4Avg[i]=parseFloat(dayAvg.ch4);
                        // co2Avg[i]=dayAvg.co2;
                        // dustAvg[i]=dayAvg.dust;
                        // humitidyAvg[i]=dayAvg.humidity;
                        // temperatureAvg[i]=dayAvg.temperature;
                        dates[i]= moment(new Date()).subtract(i, "days").format('YYYY-MM-DD');


                        // const no2AQI = this.calculateForReading(dayAvg.no2, no2Index);
                        // const dustAQI = this.calculateForReading(dayAvg.dust, dustIndex);
                        const nh3AQI = this.calculateForReading(dayAvg.nh3, nh3Index);
                        // const co2AQI = this.calculateForReading(dayAvg.co2, co2Index);
                        const coAQI = this.calculateForReading(dayAvg.co, coIndex);
                        // const ch4AQI = this.calculateForReading(dayAvg.ch4, ch4Index);

                        // let AQI=Math.round(this.calculateAQIAverage([
                        //     dustAQI, nh3AQI, co2AQI, coAQI, no2AQI, ch4AQI
                        // ]));

                        // AQIAvg[i]=AQI;


                        // res.locals.AQIGraphData.last10Values[i]=parseFloat(last10Values[i].ch4)



                        let dayDataNh3=await services.getNh3DayValuesAsync(req.params.id, i);

                        let dayDataCo=await services.getCoDayValuesAsync(req.params.id, i);


                        try{
                            if(i!=0){

                            
                                // ML Models Predictions
                                const modelUrlNh3 = 'http://localhost:3001/assets/model/1kvalues/model_nh3/model.json'
                                // 1 Value prediction
                                const modelNh3= await tf.loadLayersModel(modelUrlNh3);

                                console.log('NH3 ML model loaded succesfully');

                                let predicteds=modelNh3.predict(tf.reshape(dayDataNh3.nh3,[-1, 1000, 1]));
                                let predictions = predicteds.dataSync();


                                let predicted_nh3=(-predictions[0]-0)*(Math.max(...dayDataNh3.nh3)-Math.min(...dayDataNh3.nh3))+Math.min(...dayDataNh3.nh3)

                                nh3AvgPredicted[i]=Math.abs(predicted_nh3);
                            } else if(i==0){
                                nh3AvgPredicted[i]=dayAvg.nh3;
                            }
                        } catch(error){
                            logger.error('ERROR', error);
                        }


                        try{
                            if(i!=0){
                                // ML Models Predictions
                                const modelUrlCo = 'http://localhost:3001/assets/model/1kvalues/model_dust/model.json'
                                // 1 Value prediction
                                const modelCo= await tf.loadLayersModel(modelUrlCo);
                                // dayDataDust
                                console.log('CO ML model loaded succesfully');

                                let predicteds=modelCo.predict(tf.reshape(dayDataCo.co,[-1, 1000, 1]));
                                let predictions = predicteds.dataSync();


                                let predicted_co=(-predictions[0]-0)*(Math.max(...dayDataCo.co)-Math.min(...dayDataCo.co))+Math.min(...dayDataCo.co)

                                coAvgPredicted[i]=Math.abs(predicted_co);
                            } else if(i==0){
                                coAvgPredicted[i]=dayAvg.co+3;
                            }
                        } catch(error){
                            logger.error('ERROR', error);
                        }

                }
                

                        res.locals.AQIGraphData.nh3Avg = nh3Avg;
                        res.locals.AQIGraphData.coAvg = coAvg;
                        // res.locals.AQIGraphData.no2Avg = no2Avg;
                        // res.locals.AQIGraphData.ch4Avg = ch4Avg;
                        // res.locals.AQIGraphData.co2Avg = co2Avg;
                        // res.locals.AQIGraphData.dustAvg = dustAvg;
                        // res.locals.AQIGraphData.humitidyAvg = humitidyAvg;
                        // res.locals.AQIGraphData.temperatureAvg = temperatureAvg;
                        res.locals.AQIGraphData.dates = dates;
                
                        // res.locals.AQIGraphData.AQIAvg = AQIAvg;

                        res.locals.AQIGraphData.nh3AvgPredicted=nh3AvgPredicted;
                        res.locals.AQIGraphData.coAvgPredicted=coAvgPredicted;
                        // res.locals.AQIGraphData.no2AvgPredicted=no2AvgPredicted;

                        // res.locals.AQIGraphData.temperatureAvgPredicted=temperatureAvgPredicted;


                
                        logger.info(res.locals.AQIGraphData)
                        
                        next();

            });
    });

};



// NO2, CH4, CO2 
exports.getAQIGraphML3 = function (req, res, next) {
    res.locals.AQIGraphData = {

        // last10Values : [],
        // nh3Avg: [0],
        // coAvg: [0],
        no2Avg: [0],
        ch4Avg: [0],
        co2Avg: [0],
        // dustAvg: [0],
        // humitidyAvg: [0],
        // temperatureAvg: [0],
        dates: [],
        // humitidyAvgPredicted: [0],
        // dustAvgPredicted:[0],
        no2AvgPredicted:[0],
        ch4AvgPredicted:[0],
        co2AvgPredicted: [0]
    };

    // const nh3Index = [200, 400, 800, 1200, 1800];
    // const coIndex = [4.4, 9.4, 12.4, 15.4, 30.4, 40.4];
    const no2Index = [0.053, 0.1, 0.36, 0.65, 1.24, 1.64];
    const ch4Index = [50, 100, 150, 200, 300, 400];
    const co2Index = [1000, 2000, 5000, 10000, 20000, 40000];
    // const dustIndex = [12, 35.4, 150.4, 250.4, 350.4];
    // const ranges = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500]];
    
    // let nh3Avg = [];
    // let coAvg = [];
    let no2Avg = [];
    let ch4Avg = [];
    let co2Avg = [];
    // let dustAvg = [];
    // let humitidyAvg = [];
    // let temperatureAvg = [];
    let dates = [];

    // let AQIAvg = [];
    // let humitidyAvgPredicted = [];
    // let dustAvgPredicted=[]
    let no2AvgPredicted=[]
    let ch4AvgPredicted = [];
    let co2AvgPredicted = [];

    let last10Values = [];

    services.get10lastdates(req.params.id, async function (err, last10dates) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all AirReading'});
        }

        services.get11lastvalues(req.params.id, async function (err, last10Values) {
            if (err) {
                logger.error(err);
                return res.status(400).send({msg: 'Error in get all AirReading'});
            }
            // logger.error(last10Values);

            // try{

            //     const modelUrlTemperature = 'http://localhost:3001/assets/model/1kvalues/model_temperature/model.json'
            //     const modelTemperature= await tf.loadLayersModel(modelUrlTemperature);
            //     console.log('Temperature ML model loaded succesfully');
                
            //     const modelUrlHumidity = 'http://localhost:3001/assets/model/1kvalues/model_humidity/model.json'            
            //     const modelHumidity= await tf.loadLayersModel(modelUrlHumidity);
            //     console.log('Humidity ML model loaded succesfully');

            //     const modelUrlDust = 'http://localhost:3001/assets/model/1kvalues/model_dust/model.json'
            //     const modelDust= await tf.loadLayersModel(modelUrlDust);
            //     console.log('Dust ML model loaded succesfully');
            
            //     const modelUrlNo2 = 'http://localhost:3001/assets/model/1kvalues/model_no2/model.json'
            //     const modelNo2= await tf.loadLayersModel(modelUrlNo2);
            //     console.log('NO2 ML model loaded succesfully');

            // } catch(error){
            //     logger.error('ERROR', error);
            // }
                for(let i=last10dates.length-1; i>=0; i--){
                    let dayAvg=await services.getAvgValuesdatesAsync(req.params.id, i);//, function (err, dayAvg) {

                        // nh3Avg[i]=dayAvg.nh3;
                        // coAvg[i]=dayAvg.co;
                        no2Avg[i]=dayAvg.no2;
                        ch4Avg[i]=parseFloat(dayAvg.ch4);
                        co2Avg[i]=dayAvg.co2;
                        // dustAvg[i]=dayAvg.dust;
                        // humitidyAvg[i]=dayAvg.humidity;
                        // temperatureAvg[i]=dayAvg.temperature;
                        dates[i]= moment(new Date()).subtract(i, "days").format('YYYY-MM-DD');


                        const no2AQI = this.calculateForReading(dayAvg.no2, no2Index);
                        // const dustAQI = this.calculateForReading(dayAvg.dust, dustIndex);
                        // const nh3AQI = this.calculateForReading(dayAvg.nh3, nh3Index);
                        const co2AQI = this.calculateForReading(dayAvg.co2, co2Index);
                        // const coAQI = this.calculateForReading(dayAvg.co, coIndex);
                        const ch4AQI = this.calculateForReading(dayAvg.ch4, ch4Index);

                        // let AQI=Math.round(this.calculateAQIAverage([
                        //     dustAQI, nh3AQI, co2AQI, coAQI, no2AQI, ch4AQI
                        // ]));

                        // AQIAvg[i]=AQI;



                        let dayDataNo2=await services.getNo2DayValuesAsync(req.params.id, i);

                        let dayDataCh4=await services.getCh4DayValuesAsync(req.params.id, i);

                        let dayDataCo2=await services.getCo2DayValuesAsync(req.params.id, i);
                        
                        try{
                            if(i!=0){
                                // ML Models Predictions
                                const modelUrlNo2 = 'http://localhost:3001/assets/model/1kvalues/model_no2/model.json'
                                // 1 Value prediction
                                const modelNo2= await tf.loadLayersModel(modelUrlNo2);
                                // dayDataDust
                                console.log('NO2 ML model loaded succesfully');

                                let predicteds=modelNo2.predict(tf.reshape(dayDataNo2.no2,[-1, 1000, 1]));
                                let predictions = predicteds.dataSync();

                                let predicted_no2=(-predictions[0]-0)*(Math.max(...dayDataNo2.no2)-Math.min(...dayDataNo2.no2))+Math.min(...dayDataNo2.no2)

                                no2AvgPredicted[i]=Math.abs(predicted_no2);
                            } else if(i==0){
                                no2AvgPredicted[i]=dayAvg.no2+2;
                            }
                        } catch(error){
                            logger.error('ERROR', error);
                        }
                        
                        
                    
                        try{
                            if(i!=0){
                                // ML Models Predictions
                                const modelUrlCh4 = 'http://localhost:3001/assets/model/1kvalues/model_ch4/model.json'
                                // 1 Value prediction
                                const modelCh4= await tf.loadLayersModel(modelUrlCh4);
                                // dayDataDust
                                console.log('Ch4 ML model loaded succesfully');

                                let predicteds=modelCh4.predict(tf.reshape(dayDataCh4.ch4,[-1, 1000, 1]));
                                let predictions = predicteds.dataSync();


                                let predicted_ch4=(-predictions[0]-0)*(Math.max(...dayDataCh4.ch4)-Math.min(...dayDataCh4.ch4))+Math.min(...dayDataCh4.ch4)

                                ch4AvgPredicted[i]=Math.abs(predicted_ch4);
                            } else if(i==0){
                                ch4AvgPredicted[i]=dayAvg.ch4;
                            }
                        } catch(error){
                            logger.error('ERROR', error);
                        }


                        
                        // CO2
                        try{
                            if(i!=0){
                                // ML Models Predictions
                                const modelUrl = 'http://localhost:3001/assets/model/1kvalues/model_co2/model.json'
                                // 1 Value prediction
                                const model= await tf.loadLayersModel(modelUrl);

                                console.log('CO2 ML model loaded succesfully');

                                let predicteds=model.predict(tf.reshape(dayDataCo2.co2,[-1, 1000, 1]));
                                let predictions = predicteds.dataSync();


                                let predicted_co2=(-predictions[0]-0)*(Math.max(...dayDataCo2.co2)-Math.min(...dayDataCo2.co2))+Math.min(...dayDataCo2.co2)

                                co2AvgPredicted[i]=Math.abs(predicted_co2);
                            } else if(i==0){
                                co2AvgPredicted[i]=dayAvg.co2;
                            }
                        } catch(error){
                            logger.error('ERROR', error);
                        }
                }
                

                        // res.locals.AQIGraphData.nh3Avg = nh3Avg;
                        // res.locals.AQIGraphData.coAvg = coAvg;
                        res.locals.AQIGraphData.no2Avg = no2Avg;
                        res.locals.AQIGraphData.ch4Avg = ch4Avg;
                        res.locals.AQIGraphData.co2Avg = co2Avg;
                        // res.locals.AQIGraphData.dustAvg = dustAvg;
                        // res.locals.AQIGraphData.humitidyAvg = humitidyAvg;
                        // res.locals.AQIGraphData.temperatureAvg = temperatureAvg;
                        res.locals.AQIGraphData.dates = dates;
                
                        // res.locals.AQIGraphData.AQIAvg = AQIAvg;

                        res.locals.AQIGraphData.no2AvgPredicted=no2AvgPredicted;
                        res.locals.AQIGraphData.ch4AvgPredicted=ch4AvgPredicted;
                        res.locals.AQIGraphData.co2AvgPredicted=co2AvgPredicted;

                        logger.info(res.locals.AQIGraphData)

                        next();

            });
    });

};