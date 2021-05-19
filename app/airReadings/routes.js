const {getAllAirReadings, getAllAirReadingsWithPagination, getAllAirReadingsByNode, createAirReading, deleteAirReading, updateAirReading} = require('./controller');
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

router.get('/get-all-readings-by-node/:id', getAllAirReadingsByNode, function (req, res) {
    res.send(res.locals.allAirReadings);
});

router.post('/create-reading', validateField, createAirReading, function (req, res) {
    res.send(res.locals.Msg);
});

router.delete('/delete-reading/:id', deleteAirReading, function (req, res) {
    res.send(res.locals.Msg);
});

module.exports = router;