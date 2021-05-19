const {sendAppUserOTP, sendDriverOTP, login, facebookLogin, driverLogin, adminLogin, getUserInfoByJWTToken, driverValidationWithoutOTP, driverLoginWithoutOTP} = require('./controller');
const {validateMobileAndOTP, validateMobile, validateMobileAndAccessLogin, validateEmailAndPassword, validateJWT, validateMobileAndFcm} = require('../auth/validations');

const router = require('express').Router();

router.post('/send-app-user-otp', validateMobile, sendAppUserOTP, function (req, res) {
    res.send(res.locals.Msg);
});
router.post('/send-driver-otp', validateMobile, sendDriverOTP, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/driver-validation-without-otp', validateMobile, driverValidationWithoutOTP, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/app-user-login', validateMobileAndOTP, login, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/app-user-facebook-login', validateMobileAndAccessLogin, facebookLogin, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/driver-login', validateMobileAndOTP, driverLogin, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/driver-login-without-otp', validateMobileAndFcm, driverLoginWithoutOTP, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/admin-login', validateEmailAndPassword, adminLogin, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/access-token', validateJWT, getUserInfoByJWTToken, function (req, res) {
    res.send(res.locals.Msg);
});

module.exports = router;