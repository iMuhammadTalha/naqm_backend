const {getAllFarmBotReadings, getAllFarmBotReadingsWithPagination, getANodeAllFarmBotReadingsWithPagination, getAllFarmBotReadingsByFarmBot, createFarmBotReading, deleteFarmBotReading, getGraph} = require('./controller');
const {validateField} = require('../farmbotReadings/validations');
// const {isTokenExpired,paginationValidation} = require('../../lib/validation');

const router = require('express').Router();
                                
router.get('/get-all-readings', getAllFarmBotReadings, function (req, res) {
    res.send(res.locals.allFarmBotReadings);
});
                                                                        // isTokenExpired,paginationValidation,
router.get('/get-all-readings/:page/:pageSize/:sortingName/:sortingOrder',  getAllFarmBotReadingsWithPagination, function (req, res) {
    res.send(res.locals.allFarmBotReadings);
});

router.get('/get-a-animal-all-readings/:id/:page/:pageSize/:sortingName/:sortingOrder',  getANodeAllFarmBotReadingsWithPagination, function (req, res) {
    res.send(res.locals.allFarmBotReadings);
});

router.get('/get-all-readings-by-node/:id', getAllFarmBotReadingsByFarmBot, function (req, res) {
    res.send(res.locals.allFarmBotReadings);
});

router.post('/create-reading', validateField, createFarmBotReading, function (req, res) {
    res.send(res.locals.Msg);
});

router.delete('/delete-reading/:id', deleteFarmBotReading, function (req, res) {
    res.send(res.locals.Msg);
});

// router.get('/get-a-recent-reading/:id', getARecentReading, function (req, res) {
//     res.send(res.locals.aFarmBotReading);
// });

router.get('/get-graph/:id', getGraph, function (req, res) {
    res.send(res.locals.GraphData);
});

module.exports = router;