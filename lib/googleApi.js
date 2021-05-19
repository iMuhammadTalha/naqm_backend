const axios = require('axios');
const config = require('../config');
const {googleApiKey} = require('../lib/helper');
const logger = config.logger.createLogger('lib/googleAPI');
const services = require('./services');


exports.distanceCalculate = async (data) => {

    // services.getASettings('googleMapApiKey' , async function(err, googleApiKey) {
    //     if (err) {
    //         logger.error('Error:', err);
    //     }
    let apiKey = 'AIzaSyDWopWd36r3M64PhTQnWJY77PtBWkjIINQ';
    // if(googleApiKey[0] && googleApiKey[0].value){
    //     apiKey=googleApiKey[0].value;
    // }

    const Url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${data.source_lat},${data.source_long}&destinations=${data.distination_lat},${data.distination_long}&departure_time=now&key=${apiKey}`;

    const distanceCalculate = await axios.post(`${Url}`);


    if (distanceCalculate) {
        return (distanceCalculate.data);
    } else {
        return (distanceCalculate.data);
    }
    // });
};