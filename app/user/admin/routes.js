const {getAllAdmins, getAAdmin, createAdmin, deleteAdmin, updateAdmin, loginAdmin, getTotalRides, getTotalCompletedRides, getRevenue, getTotalEarning, getTotalServices, getTotalCancelledRides, getTotalUserCancelledRides, getTotalDriverCancelledRides, getTotalDrivers, getRecentCompletedRides, getRecentCancelledRides, getOnboardingDrivers, getTopDrivers, getUsersOTPbyPhoneNumber} = require('./controller');
const {validateFieldAndAlreadyEmailAndAlreadyMobile, validateEmailAndPassword} = require('../admin/validations');
const {isTokenExpired, paginationValidation,getCitiesIdFromAdminToken} = require('../../../lib/validation');

const router = require('express').Router();
const upload = require('../../../lib/imageUpload');

router.get('/get-all-admin', isTokenExpired, getAllAdmins, function (req, res) {
    res.send(res.locals.allAdminUsers);
});

router.get('/get-a-admin/:id', isTokenExpired, getAAdmin, function (req, res) {
    res.send(res.locals.aAdminUser);
});

router.post('/register-admin', upload.single('image'), validateFieldAndAlreadyEmailAndAlreadyMobile, createAdmin, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/login-admin', validateEmailAndPassword, loginAdmin, function (req, res) {
    res.send(res.locals.Msg);
});

router.put('/update-admin/:id', isTokenExpired, upload.single('image'), updateAdmin, function (req, res) {
    res.send(res.locals.Msg);
});

router.delete('/delete-admin/:id', isTokenExpired, deleteAdmin, function (req, res) {
    res.send(res.locals.Msg);
});

router.get('/get-total-rides/:time', isTokenExpired, getCitiesIdFromAdminToken, getTotalRides, function (req, res) {
    res.send(res.locals.totalRides);
});

router.get('/get-total-completed-rides/:time', isTokenExpired, getCitiesIdFromAdminToken, getTotalCompletedRides, function (req, res) {
    res.send(res.locals.totalCompletedRides);
});

router.get('/get-total-earning/:time', isTokenExpired, getCitiesIdFromAdminToken, getTotalEarning, function (req, res) {
    res.send(res.locals.totalEarning);
});

router.get('/get-revenue/:time', isTokenExpired, getCitiesIdFromAdminToken, getRevenue, function (req, res) {
    res.send(res.locals.totalRevenue);
});

router.get('/get-total-service', isTokenExpired, getTotalServices, function (req, res) {
    res.send(res.locals.totalServices);
});

router.get('/get-total-cancelled-rides/:time', isTokenExpired, getCitiesIdFromAdminToken, getTotalCancelledRides, function (req, res) {
    res.send(res.locals.totalCancelledRides);
});

router.get('/get-total-user-cancelled-rides/:time', isTokenExpired, getCitiesIdFromAdminToken, getTotalUserCancelledRides, function (req, res) {
    res.send(res.locals.totalUserCancelledRides);
});

router.get('/get-total-driver-cancelled-rides/:time', isTokenExpired, getCitiesIdFromAdminToken, getTotalDriverCancelledRides, function (req, res) {
    res.send(res.locals.totalDriverCancelledRides);
});

router.get('/get-total-drivers', isTokenExpired, getCitiesIdFromAdminToken, getTotalDrivers, function (req, res) {
    res.send(res.locals.totalDrivers);
});

router.get('/get-recent-completed-rides', isTokenExpired, getCitiesIdFromAdminToken, getRecentCompletedRides, function (req, res) {
    res.send(res.locals.recentCompletedRides);
});

router.get('/get-recent-cancelled-rides', isTokenExpired, getCitiesIdFromAdminToken, getRecentCancelledRides, function (req, res) {
    res.send(res.locals.recentCancelledRides);
});

router.get('/get-onboarding-drivers', isTokenExpired, getCitiesIdFromAdminToken, getOnboardingDrivers, function (req, res) {
    res.send(res.locals.onboardingDrivers);
});

router.get('/get-top-5-drivers', isTokenExpired, getTopDrivers, function (req, res) {
    res.send(res.locals.topDrivers);
});

router.get('/get-all-users-otp/:page/:pageSize/:sortingName/:sortingOrder/:phone_number', isTokenExpired,paginationValidation ,getUsersOTPbyPhoneNumber, function (req, res) {
    res.send(res.locals.users);
});

module.exports = router;