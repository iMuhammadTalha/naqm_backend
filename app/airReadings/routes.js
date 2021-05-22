const {getAllAirReadings, getAQI, getAllAirReadingsWithPagination, getANodeAllAirReadingsWithPagination, getAllAirReadingsByNode, createAirReading, deleteAirReading, getARecentReading} = require('./controller');
const {validateField} = require('../airReadings/validations');
// const {isTokenExpired,paginationValidation} = require('../../lib/validation');

const router = require('express').Router();
                                
router.get('/get-all-readings', getAllAirReadings, function (req, res) {
    res.send(res.locals.allAirReadings);
});
                                                                        // isTokenExpired,paginationValidation,
router.get('/get-all-readings/:page/:pageSize/:sortingName/:sortingOrder',  getAllAirReadingsWithPagination, function (req, res) {
    res.send(res.locals.allAirReadings);
});

router.get('/get-a-node-all-readings/:id/:page/:pageSize/:sortingName/:sortingOrder',  getANodeAllAirReadingsWithPagination, function (req, res) {
    res.send(res.locals.allAirReadings);
});

router.get('/get-all-readings-by-node/:id', getAllAirReadingsByNode, function (req, res) {
    res.send(res.locals.allAirReadings);
});

router.post('/create-reading', validateField, createAirReading, function (req, res) {
    res.send(res.locals.Msg);
});

router.delete('/delete-reading/:id', deleteAirReading, function (req, res) {
    res.send(res.locals.Msg);
});

router.get('/get-AQI/:id', getAQI, function (req, res) {
    res.send(res.locals.aqi);
});

router.get('/get-a-recent-reading/:id', getARecentReading, function (req, res) {
    res.send(res.locals.aAirReading);
});

module.exports = router;