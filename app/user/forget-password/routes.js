
const {sendEmail, resetNewPassword} = require('./controller');
const {validateEmail, validatePassword} = require('./validations');

const router = require('express').Router();

router.post('/send-email', validateEmail, sendEmail, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/change-password', validatePassword, resetNewPassword, function (req, res) {
    res.send(res.locals.Msg);
});

module.exports = router;