exports.validateMobileAndOTP = function (req, res, next) {
    if (req.headers.device_type) {
        if (req.body.otp && req.body.mobile_number && req.body.fcm_token) {
            next();
        } else {
            res.status(400).send({msg: 'Please provide valid code & phoneNumber & FCM Token...'});
        }
    } else {
        res.status(400).send({msg: 'Please provide device type...'});
    }
};

exports.validateMobileAndFcm = function (req, res, next) {
    if (req.headers.device_type) {
        if (req.body.mobile_number && req.body.fcm_token) {
            next();
        } else {
            res.status(400).send({msg: 'Please provide phoneNumber & FCM Token...'});
        }
    } else {
        res.status(400).send({msg: 'Please provide device type...'});
    }
};

exports.validateMobile = function (req, res, next) {
    if (req.body.mobile_number) {
        const regMobile = /^[0-9]+$/;
        if (regMobile.test(req.body.mobile_number)) {
            next();
        } else {
            res.status(400).send({msg: 'Wrong Mobile Number...'});
        }
    } else {
        res.status(400).send({msg: 'Please provide phone Number...'});
    }

};

exports.validateMobileAndAccessLogin = function (req, res, next) {
    if (req.headers.device_type) {
        if (req.body.mobile_number && req.body.access_token && req.body.fcm_token) {
            const regMobile = /^[0-9]+$/;
            if (regMobile.test(req.body.mobile_number)) {
                next();
            } else {
                res.status(400).send({msg: 'Wrong Mobile Number...'});
            }
        } else {
            res.status(400).send({msg: 'Please provide phone Number & FB access token & FCM Token...'});
        }
    } else {
        res.status(400).send({msg: 'Please provide device type...'});
    }
};

exports.validateEmailAndPassword = function (req, res, next) {
    // next();
    if (req.body.email && req.body.password) {
        next();
    } else {
        res.status(400).send({msg: 'Please provide email & password both...'});
    }
};

exports.validateJWT = function (req, res, next) {
    if (req.body.access_token) {
        next();
    } else {
        res.status(400).send('Please provide JWT Token...');
    }
};