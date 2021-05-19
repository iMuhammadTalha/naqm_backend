const services = require('../services');
const config = require('../../../config');
const logger = config.logger.createLogger('user/admin/validation');

const isRequiredFieldMiss = function (req) {
    return (!(req.body.email && req.body.mobile_number && req.body.role && req.body.password));
};

const isValidEmail = function (email) {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};
const validatePassword = function (password) {
    return !(password.length <= 5 || password === '');
};
const isMobileAlreadyExists = function (mobile, res) {
    return new Promise(async (resolve, reject) => {
        services.isAlreadyMobileExsists(mobile, function (err, result) {
            if (err) {
                logger.error(err);
                res.status(400).send(err);
                return reject(err);
            }
            return resolve(result.length > 0);
        });
    });
};

const isEmailAlreadyExists = function (email, res) {
    return new Promise(async (resolve, reject) => {
        services.isAlreadyEmailExsists(email, function (err, result) {
            if (err) {
                logger.error(err);
                res.status(400).send(err);
                return reject(err);
            }
            return resolve(result.length > 0);
        });
    });
};

exports.validateFieldAndAlreadyEmailAndAlreadyMobile = async function (req, res, next) {
    if (req.body.email && req.body.first_name && req.body.last_name && req.body.mobile_number && req.body.password && req.body.role) {
        const regEmail = /\S+@\S+\.\S+/;
        if (regEmail.test(req.body.email)) {
            const regMobile = /^[0-9]+$/;
            if (regMobile.test(req.body.mobile_number)) {
                services.isAlreadyEmailExsists(req.body.email, function (err, result) {
                    if (err) {
                        logger.error(err);
                        res.status(400).json({msg: 'Error'});
                        // return reject(err);
                    }
                    if (result.length === 0) {
                        services.isAlreadyMobileExsists(req.body.mobile_number, function (err, result) {
                            if (err) {
                                logger.error(err);
                                res.status(400).json({msg: 'Error'});
                                // return reject(err);
                            }
                            if (result.length === 0) {
                                next();
                            } else {
                                res.status(400).json({msg: 'Mobile Number already exsists...'});
                            }
                        });
                    } else {
                        res.status(400).json({msg: 'Email already exsists...'});
                    }
                });
            } else {
                res.status(400).json({msg: 'Wrong Mobile Number...'});
            }
        } else {
            res.status(400).json({msg: 'Wrong Email Address...'});
        }
    } else {
        res.status(400).send('Please provide required fields...');
    }
};

exports.validateEmailAndPassword = function (req, res, next) {

    if (req.body.email && req.body.password) {
        next();
    } else {
        res.status(400).send('Required fields missed...');
    }
};