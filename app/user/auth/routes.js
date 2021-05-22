const {adminLogin, getUserInfoByJWTToken} = require('./controller');
const {validateMobileAndOTP, validateMobile, validateMobileAndAccessLogin, validateEmailAndPassword, validateJWT, validateMobileAndFcm} = require('../auth/validations');

const router = require('express').Router();

router.post('/admin-login', validateEmailAndPassword, adminLogin, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/access-token', getUserInfoByJWTToken, function (req, res) {
    res.send(res.locals.Msg);
});

module.exports = router;