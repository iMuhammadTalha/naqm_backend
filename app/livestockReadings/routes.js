const {getAllAnimalReadings, getAQI, getAllAnimalReadingsWithPagination, getANodeAllAnimalReadingsWithPagination, getAllAnimalReadingsByAnimal, createAnimalReading, deleteAnimalReading} = require('./controller');
const {validateField} = require('../airReadings/validations');
// const {isTokenExpired,paginationValidation} = require('../../lib/validation');

const router = require('express').Router();
                                
router.get('/get-all-readings', getAllAnimalReadings, function (req, res) {
    res.send(res.locals.allAnimalReadings);
});
                                                                        // isTokenExpired,paginationValidation,
router.get('/get-all-readings/:page/:pageSize/:sortingName/:sortingOrder',  getAllAnimalReadingsWithPagination, function (req, res) {
    res.send(res.locals.allAnimalReadings);
});

router.get('/get-a-animal-all-readings/:id/:page/:pageSize/:sortingName/:sortingOrder',  getANodeAllAnimalReadingsWithPagination, function (req, res) {
    res.send(res.locals.allAnimalReadings);
});

router.get('/get-all-readings-by-animal/:id', getAllAnimalReadingsByAnimal, function (req, res) {
    res.send(res.locals.allAnimalReadings);
});

router.post('/create-reading', validateField, createAnimalReading, function (req, res) {
    res.send(res.locals.Msg);
});

router.delete('/delete-reading/:id', deleteAnimalReading, function (req, res) {
    res.send(res.locals.Msg);
});

// router.get('/get-a-recent-reading/:id', getARecentReading, function (req, res) {
//     res.send(res.locals.aAnimalReading);
// });

module.exports = router;