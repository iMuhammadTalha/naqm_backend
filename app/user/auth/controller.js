const moment = require('moment');
const services = require('./services');
const config = require('../../../config');
const {rand} = require('../../../lib/helper');
const {sendMessage} = require('../../../lib/otp');
const jwt = require('jsonwebtoken');
const keys = process.env.JWT_TOKEN_SECRET;
const logger = config.logger.createLogger('user/auth/controller');
const bcrypt = require('bcryptjs');

exports.sendAppUserOTP = function (req, res, next) {
    let verificationCode = rand(1000, 9999);     //  Fixed OTP 1234
    const mobile_number = req.body.mobile_number;
    if (mobile_number == '3352700381' || mobile_number == '3335258678') {
        verificationCode = 1234;
    }
    services.getAUser(mobile_number, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get a user'});
        }
        if (rows.rowCount > 0) {
            let oneHourPreviousTime = moment(new Date()).subtract(1, 'h');
            if (oneHourPreviousTime.isBefore(rows.rows[0].created_date)) {
                logger.debug('App user login again within 1 hour. So previous OTP will be use.');
                verificationCode = rows.rows[0].otp;
            } else {
                let updateUserOTP = {
                    otp: verificationCode,
                    created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    mobile_number: req.body.mobile_number
                };

                services.updateUserOTPCode(updateUserOTP, function (err, user) {
                    if (err) res.status(400).json({msg: err});
                    logger.debug('updated user ');
                });
            }

        } else {
            var newUser = {
                mobile_number: req.body.mobile_number,
                user_type: 'app_user',
                otp: verificationCode,
                method: 'mobile',
                todayDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            };

            services.createAppUser(newUser, function (err, user) {
                if (err) {
                    logger.error(err);
                    return res.status(400).send({msg: 'Error in create a user'});
                }
                logger.debug('new user');
            });
        }
        logger.warn('otp:', verificationCode);
        logger.warn('mobile:', mobile_number);

        const sendVerificationCode = sendMessage(verificationCode, 'User', mobile_number, 'FCiWV/TMMXj');       // Send OTP
        if(parseInt(mobile_number.substring(0, 2))===33){
            res.status(200).json({						// Response send with OTP code for ufone user
                msg: 'message sent successfully',
                otp: verificationCode+'',
                mobile_number: mobile_number
            });
        } else {
            res.status(200).json({						// Response send without OTP code
                msg: 'message sent successfully',
                mobile_number: mobile_number
            });
        } 
    });
};

exports.sendDriverOTP = function (req, res, next) {
    const mobile_number = req.body.mobile_number;
    services.getAUser(mobile_number, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get a user'});
        }
        if (rows.rowCount > 0) {
            let verificationCode = rand(1000, 9999); //  Fixed OTP 1234
            if (mobile_number == '3352200381') {
                verificationCode = 1234;
            }
            let oneHourPreviousTime = moment(new Date()).subtract(1, 'h');
            if (oneHourPreviousTime.isBefore(rows.rows[0].created_date)) {
                logger.debug('Driver login again within 1 hour. So previous OTP will be use.');
                verificationCode = rows.rows[0].otp;
            } else {
                let updateUserOTP = {
                    otp: verificationCode,
                    created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    mobile_number: req.body.mobile_number
                };

                services.updateUserOTPCode(updateUserOTP, function (err, user) {
                    if (err) res.status(400).json({msg: err});
                    logger.debug('updated user ');
                });
            }
            logger.warn('otp:', verificationCode);
            logger.warn('mobile:', mobile_number);
            const sendVerificationCode = sendMessage(verificationCode, 'Driver', mobile_number, 'aa+t06nRG/d');     // Send OTP
            if(parseInt(mobile_number.substring(0, 2))===33){
                res.status(200).json({						// Response send with OTP code for ufone user
                    msg: 'message sent successfully',
                    otp: verificationCode+'',
                    mobile_number: mobile_number
                });
            } else {
                res.status(200).json({						// Response send without OTP code
                    msg: 'message sent successfully',
                    mobile_number: mobile_number
                });
            }
        } else {
            res.status(400).json({
                msg: 'Mobile Number not found. Please Register',
                mobile_number
            });
        }
    });
};

exports.login = function (req, res) {
    let otp;
    if (isNaN(parseInt(req.body.otp))) {
        let otpMsg = req.body.otp;
        logger.error('login OTP', req.body.otp);
        let otpSplit = otpMsg.split('Your OTP for verification is ');
        let otpString = otpSplit[1][0] + otpSplit[1][1] + otpSplit[1][2] + otpSplit[1][3];
        otp = parseInt(otpString);
        // otp = parseInt(otpSplit[1]);
    } else {
        otp = req.body.otp;
    }

    var user = {
        mobile_number: req.body.mobile_number,
        otp: otp
    };

    services.findUserWithOTP(user, function (err, user) {
        if (err) {
            logger.error(err);
            return res.status(400).send(err);
        } else if (user.rowCount === 0) {
            return res.status(404).send({msg: 'PhoneNumber / OTP not valid'});
        }

        if (user.rows[0].user_type !== req.body.role) {
            if (user.rows[0].user_type === 'driver') {
                return res.status(401).send({msg: 'Login with driver app'});
            } else {
                return res.status(401).send({msg: 'Login with user app'});
            }
        }
        // User Matched
        const payload = {
            id: user.rows[0].id,
            mobile_number: user.rows[0].mobile_number,
            user_type: user.rows[0].user_type
        }; // Create JWT Payload

        // Sign Token
        const token = jwt.sign(payload, keys, {expiresIn: 3600000000000000});

        var updateAppUserJWTToken = {
            jwt: token,
            fcm: req.body.fcm_token,
            user_id: user.rows[0].id
        };

        services.updateUserJWTToken(updateAppUserJWTToken, function (err, updatedUserJwtToken) {
            if (err) res.status(400).json({msg: err});
        });

        var updateAppUserDeviceInfo = {
            device_type: req.headers.device_type,
            user_id: user.rows[0].id
        };

        services.updateUserDeviceInfo(updateAppUserDeviceInfo, function (err, updatedUserJwtToken) {
            if (err) res.status(400).json({msg: err});
        });

        if (user.rows[0].isDelete) {
            res.status(440).json({msg: 'Your account has been suspended. Please contact buraak support.'});
        } else {
            res.status(200).json({
                token: 'Bearer ' + token,
                user_id: user.rows[0].id,
                profile_pic: user.rows[0].profile_pic,
                email: user.rows[0].email,
                first_name: user.rows[0].first_name,
                last_name: user.rows[0].last_name
            });
        }

    });
};

exports.driverLogin = function (req, res) {
    let otp;
    if (isNaN(parseInt(req.body.otp))) {
        let otpMsg = req.body.otp;
        logger.error('login OTP', req.body.otp);
        let otpSplit = otpMsg.split('Your OTP for verification is ');
        let otpString = otpSplit[1][0] + otpSplit[1][1] + otpSplit[1][2] + otpSplit[1][3];
        otp = parseInt(otpString);
        // otp = parseInt(otpSplit[1]);
    } else {
        otp = req.body.otp;
    }

    var user = {
        mobile_number: req.body.mobile_number,
        otp: otp
    };

    services.findDriverWithOTP(user, function (err, user) {
        if (err) {
            return res.status(400).send(err);
        } else if (user.rowCount === 0) {
            return res.status(404).send({msg: 'PhoneNumber / OTP not valid'});
        }

        if (user.rows[0].user_type !== req.body.role) {
            if (user.rows[0].user_type === 'driver') {
                return res.status(401).send({msg: 'Login with driver app'});
            } else {
                return res.status(401).send({msg: 'Login with user app'});
            }
        }
        // User Matched
        const payload = {
            id: user.rows[0].id,
            mobile_number: user.rows[0].mobile_number,
            user_type: user.rows[0].user_type
        }; // Create JWT Payload

        // Sign Token
        const token = jwt.sign(payload, keys, {expiresIn: 3600000000000000});

        var updateAppUserJWTToken = {
            jwt: token,
            fcm: req.body.fcm_token,
            user_id: user.rows[0].id
        };

        services.updateUserJWTToken(updateAppUserJWTToken, function (err, updatedUserJwtToken) {
            if (err) res.status(400).json({msg: err});
        });

        var updateAppUserDeviceInfo = {
            device_type: req.headers.device_type,
            user_id: user.rows[0].id
        };

        services.updateUserDeviceInfo(updateAppUserDeviceInfo, function (err, updatedUserJwtToken) {
            if (err) res.status(400).json({msg: err});
        });

        res.status(200).json({
            token: 'Bearer ' + token,
            user_id: user.rows[0].id,
            profile_pic: user.rows[0].profile_pic,
            email: user.rows[0].email,
            first_name: user.rows[0].first_name,
            last_name: user.rows[0].last_name,
            verified: user.rows[0].verified
        });

    });
};

exports.driverLoginWithoutOTP = function (req, res) {

    var user = {
        mobile_number: req.body.mobile_number
    };

    services.getADriverUser(user.mobile_number, function (err, user) {
        if (err) {
            return res.status(400).send(err);
        } else if (user.rowCount === 0) {
            return res.status(404).send({msg: 'PhoneNumber not found'});
        }

        if (user.rows[0].user_type !== req.body.role) {
            if (user.rows[0].user_type === 'driver') {
                return res.status(401).send({msg: 'Login with driver app'});
            } else {
                return res.status(401).send({msg: 'Login with user app'});
            }
        }
        // User Matched
        const payload = {
            id: user.rows[0].id,
            mobile_number: user.rows[0].mobile_number,
            user_type: user.rows[0].user_type
        }; // Create JWT Payload

        // Sign Token
        const token = jwt.sign(payload, keys, {expiresIn: 3600000000000000});

        var updateAppUserJWTToken = {
            jwt: token,
            fcm: req.body.fcm_token,
            user_id: user.rows[0].id
        };

        services.updateUserJWTToken(updateAppUserJWTToken, function (err, updatedUserJwtToken) {
            if (err) res.status(400).json({msg: err});
        });

        var updateAppUserDeviceInfo = {
            device_type: req.headers.device_type,
            user_id: user.rows[0].id
        };

        services.updateUserDeviceInfo(updateAppUserDeviceInfo, function (err, updatedUserJwtToken) {
            if (err) res.status(400).json({msg: err});
        });

        res.status(200).json({
            token: 'Bearer ' + token,
            user_id: user.rows[0].id,
            profile_pic: user.rows[0].profile_pic,
            email: user.rows[0].email,
            first_name: user.rows[0].first_name,
            last_name: user.rows[0].last_name,
            verified: user.rows[0].verified
        });

    });
};

exports.facebookLogin = function (req, res) {

    var userObj = {
        mobile_number: req.body.mobile_number,
        user_id: 0,
        access_token: req.body.access_token
    };

    services.getAUser(userObj.mobile_number, function (err, alreadyUser) {
        if (err) res.send(err);

        if (alreadyUser.rowCount === 0) {
            // Not already user
            const verificationCode = 1234;

            var newUser = {
                mobile_number: req.body.mobile_number,
                user_type: 'app_user',
                otp: verificationCode,
                method: 'mobile',
                todayDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            };

            services.createAppUser(newUser, function (err, newUser) {
                if (err) res.status(400).json({msg: err});
                logger.debug('new user', newUser.rows[0].id);
                userObj.user_id = newUser.rows[0].id;
                updateFBToken(req, userObj, res);
            });
        } else {
            // Already User
            logger.debug('Already user');
            userObj.user_id = alreadyUser.rows[0].id;
            updateFBToken(req, userObj, res);
        }

    });
};

const updateFBToken = function (req, userObj, res) {
    services.updateFacebookAccessToken(userObj, function (err, updatedFBAccessToken) {
        if (err) res.status(400).json({msg: err});
        if (updatedFBAccessToken === 1) {
            logger.debug('FB Access Token updated');
        }
    });

    services.getAUser(userObj.mobile_number, function (err, user) {
        if (err) res.send(err);

        if (user.rows[0].user_type === 'driver') {
            return res.status(401).send({msg: 'Login with driver app'});
        }

        // User Matched
        const payload = {id: userObj.user_id, mobile_number: userObj.mobile_number, user_type: 'app_user'}; // Create JWT Payload

        // Sign Token
        const token = jwt.sign(payload, keys, {expiresIn: 3600000000000000});

        var updateAppUserJWTToken = {
            jwt: token,
            fcm: req.body.fcm_token,
            user_id: user.rows[0].id
        };

        services.updateUserJWTToken(updateAppUserJWTToken, function (err, updatedUserJwtToken) {
            if (err) res.status(400).json({msg: err});
        });

        var updateAppUserDeviceInfo = {
            device_type: req.headers.device_type,
            user_id: user.rows[0].id
        };

        services.updateUserDeviceInfo(updateAppUserDeviceInfo, function (err, updatedUserJwtToken) {
            if (err) res.status(400).json({msg: err});
        });

        res.status(200).json({
            token: 'Bearer ' + token,
            user_id: user.rows[0].id,
            profile_pic: user.rows[0].profile_pic,
            email: user.rows[0].email,
            first_name: user.rows[0].first_name,
            last_name: user.rows[0].last_name
        });
    });
};

exports.adminLogin = function (req, res) {

    var userCheck = {
        email: req.body.email,
        password: req.body.password
    };

    services.findAdmin(userCheck, function (err, user) {
        if (err) res.send(err);
        // Check for user
        if (user.rowCount === 0) {
            return res.status(404).send({msg: 'Admin Email is not exist'});
        } else {

            // Check Password
            bcrypt.compare(userCheck.password, user.rows[0].password).then(isMatch => {
                if (isMatch) {
                    // User Matched
                    const payload = {
                        id: user.rows[0].id,
                        email: user.rows[0].email,
                        role: user.rows[0].role
                    }; // Create JWT Payload
                    const token = jwt.sign(payload, keys, {expiresIn: 3600000000000});

                    var updateAdminJWTToken = {
                        jwt: token,
                        user_id: user.rows[0].id
                    };

                    services.updateUserJWTToken(updateAdminJWTToken, function (err, updatedAdminJwtToken) {
                        if (err) res.status(400).json({msg: err});
                    });

                    res.status(200).json({
                        token: 'Bearer ' + token,
                        user: {
                            user_id: user.rows[0].id,
                            email: user.rows[0].email,
                            displayName: user.rows[0].first_name + ' ' + user.rows[0].last_name,
                            role: user.rows[0].role
                        }
                    });
                    // });
                } else {
                    return res.status(401).send('Password incorrect');
                }
            });
        }
    });
};
exports.getUserInfoByJWTToken = function (req, res) {

    const bearer = req.body.access_token.split(' ');
    const validUser = jwt.verify(bearer[1], keys);
    if (validUser) {
        services.isJWTTokenValid(bearer[1], function (err, userJWT) {
            if (userJWT.rowCount > 0) {
                services.getUserInfo(validUser.id, function (err, user) {
                    if (err) {
                        logger.debug(err);
                    }
                    if (user.rowCount > 0) {
                        if (user.rows[0].user_type === 'admin') {
                            services.getAdminRole(validUser.id, function (err, admin) {
                                if (admin.rowCount > 0) {
                                    res.status(200).json({
                                        user_id: user.rows[0].id,
                                        displayName: user.rows[0].first_name + ' ' + user.rows[0].last_name,
                                        email: user.rows[0].email,
                                        mobile_number: user.rows[0].mobile_number,
                                        user_type: user.rows[0].user_type,
                                        role: admin.rows[0].role
                                    });
                                } else {
                                    res.status(200).json({
                                        user_id: user.rows[0].id,
                                        displayName: user.rows[0].first_name + ' ' + user.rows[0].last_name,
                                        email: user.rows[0].email,
                                        mobile_number: user.rows[0].mobile_number,
                                        user_type: user.rows[0].user_type,
                                        role: user.rows[0].user_type
                                    });
                                }
                            });
                        } else {
                            res.status(200).json({
                                user_id: user.rows[0].id,
                                displayName: user.rows[0].first_name + ' ' + user.rows[0].last_name,
                                email: user.rows[0].email,
                                mobile_number: user.rows[0].mobile_number,
                                user_type: user.rows[0].user_type,
                                role: user.rows[0].user_type
                            });
                        }
                    } else {
                        return res.status(404).send({msg: 'User not exist against this JWT'});
                    }
                });
            } else {
                return res.status(404).send({msg: 'Invalid JWT'});
            }
        });
    } else {
        return res.status(404).send('Invalid JWT Token');
    }
};

exports.driverValidationWithoutOTP = function (req, res, next) {
    const mobile_number = req.body.mobile_number;
    services.getADriverUser(mobile_number, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get a user'});
        }
        if (rows.rowCount > 0) {         
            logger.warn('mobile:', mobile_number);
            
            res.status(200).json({						// Response send without OTP code
                msg: 'Driver mobile number found',
                mobile_number: mobile_number
            });
        } else {
            res.status(400).json({
                msg: 'Mobile Number not found. Please Register',
                mobile_number
            });
        }
    });
};