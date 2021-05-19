const jwt = require('jsonwebtoken');
const keys = process.env.JWT_TOKEN_SECRET;
var services = require('../lib/services');
const config = require('../config');
const logger = config.logger.createLogger('lib/passport-jwt');

exports.isDriverOrAppUser = function (req, res, next) {
    if (req.user.user_type === 'driver' || req.user.user_type === 'app_user') {
        return next();
    } else {
        return res.status(403).json({
            Error: 'Access denied'
        });
    }
};

exports.isDriver = function (req, res, next) {
    if (req.user.user_type === 'driver') {
        return next();
    } else {
        return res.status(403).json({
            Error: 'Access denied'
        });
    }
};

exports.isAppUser = function (req, res, next) {
    if (req.user.user_type === 'app_user') {
        return next();
    } else {
        return res.status(403).json({
            Error: 'Access denied'
        });
    }
};

exports.isAdmin = function (req, res, next) {
    if (req.user.user_type === 'admin') {
        return next();
    } else {
        return res.status(403).json({
            Error: 'Access denied'
        });
    }
};

exports.isFleet = function (req, res, next) {
    if (req.user.user_type === 'fleet') {
        return next();
    } else {
        return res.status(403).json({
            Error: 'Access denied'
        });
    }
};

exports.isAdminOrFleetOrDriverOrAppUser = function (req, res, next) {
    if (req.user.user_type === 'admin' || req.user.user_type === 'fleet' || req.user.user_type === 'driver' || req.user.user_type === 'app_user') {
        return next();
    } else {
        return res.status(403).json({
            Error: 'Access denied'
        });
    }
};

exports.verifyToken = (req, res) => {
    const token = req.body.token;

    if (token) {
        const bearer = token.split(' ');
        try {
            const tokenIsValid = jwt.verify(bearer[1], process.env.JWT_TOKEN_SECRET);
            if (tokenIsValid) {
                return res.status(200).json({msg: 'token is valid'});
            }
        } catch (err) {
            if (err) {
                return res.status(400).json({msg: 'Invalid token'});
            }
        }
    } else {
        return res.status(400).json({msg: 'please provide token'});
    }
};
exports.verifyTokenAndExtractUserInfo = (req, res) => {
    const token = req.body.token;
    if (token) {
        const bearer = token.split(' ');
        try {
            const validUser = jwt.verify(bearer[1], process.env.JWT_TOKEN_SECRET);
            if (validUser) {
                return res.status(200).json(validUser);
            }
        } catch (err) {
            if (err) {
                return res.status(400).json({msg: 'Invalid token'});
            }
        }
    } else {
        return res.status(400).json({msg: 'please provide token'});
    }
};

exports.isTokenExpired = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const bearer = token.split(' ');
        try {
            const validUser = jwt.verify(bearer[1], keys);
            if (validUser) {
                let userId = validUser.id;

                services.isValidJWTToken(userId, bearer[1], function (err, userJWT) {
                    if (err) res.send(err);
                    if (!userJWT.rowCount) {
                        return res.status(440).json({msg: 'Your token has been expired. Please login again.'});
                    } else {
                        if (userJWT.rows[0].isdelete) {
                            if (userJWT.rows[0].user_type == 'driver') {
                                services.goDriverOffline(userJWT.rows[0].id, function (err, rows) {
                                    if (err) {
                                        logger.error('Error:', err);
                                    }
                                    logger.debug('Driver status changed to offline');
                                });
                            }
                            return res.status(440).json({msg: 'Your account has been suspended. Please contact buraak support.'});
                        } else {
                            if (userJWT.rows[0].user_type == 'driver') {
                                if (userJWT.rows[0].verified == 'banned') {
                                    services.goDriverOffline(userJWT.rows[0].id, function (err, rows) {
                                        if (err) {
                                            logger.error('Error:', err);
                                        }
                                        logger.debug('Driver status changed to offline');
                                        return res.status(440).json({msg: 'Your account has been suspended. Please contact buraak support.'});
                                    });
                                } else {
                                    return next();
                                }
                            } else {
                                return next();
                            }
                        }
                    }
                });

            }
        } catch (err) {
            if (err) {
                logger.error(err);
                return res.status(400).json({msg: 'Invalid token'});
            }
        }
    } else {
        return res.status(400).json({msg: 'please provide token'});
    }
};

exports.getFleetIdFromToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const bearer = token.split(' ');
        try {
            const tokenIsValid = jwt.verify(bearer[1], keys);
            if (tokenIsValid) {
                let fleetId = tokenIsValid.fleet_id;
                if (fleetId) {
                    req.user = req.user ? {...req.user, fleet_id: fleetId} : {fleet_id: fleetId};
                    return next();
                } else {
                    return res.status(400).json({msg: 'Fleet token required'});
                }
            } else {
                return res.status(400).json({msg: 'Invalid token'});
            }
        } catch (err) {
            if (err) {
                console.log(err);
                return res.status(400).json({msg: 'Invalid token'});
            }
        }
    } else {
        return res.status(400).json({msg: 'please provide token'});
    }
};

exports.getCitiesIdFromAdminToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const bearer = token.split(' ');
        try {
            const tokenIsValid = jwt.verify(bearer[1], keys);
            if (tokenIsValid) {
                let userId = tokenIsValid.id;
                if (userId) {
                    services.getAdminCities(userId, function (err, adminCities) {
                        if (err) {
                            logger.error('Error:', err);
                        }
                        if(adminCities.length>0){
                            let cities='';
                            for(let i=0; i<adminCities.length;i++){
                                cities+=adminCities[i].cityid+',';
                            } 
                            cities=cities.slice(0,-1);
                            req.user = req.user ? {...req.user, adminCities: cities} : {adminCities: cities};
                            return next();
                        } else {
                            req.user = req.user ? {...req.user, adminCities: ''} : {adminCities: ''};
                            return next();
                        }
                    });
                } else {
                    return res.status(400).json({msg: 'Admin token required'});
                }
            } else {
                return res.status(400).json({msg: 'Invalid token'});
            }
        } catch (err) {
            if (err) {
                console.log(err);
                return res.status(400).json({msg: 'Invalid token'});
            }
        }
    } else {
        return res.status(400).json({msg: 'please provide token'});
    }
};

exports.extractUserInfoFromToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        const bearer = token.split(' ');
        try {
            const validUser = jwt.verify(bearer[1], keys);
            if (validUser) {
                
                let userId = validUser.id;
                req.user = req.user ? {...req.user, user_id: userId} : {user_id: userId};
                req.user = req.user ? {...req.user, email: validUser.email} : {email: validUser.email};

                return next();
            }
        } catch (err) {
            if (err) {
                return res.status(400).json({msg: 'Invalid token'});
            }
        }
    } else {
        return res.status(400).json({msg: 'please provide token'});
    }
};

exports.paginationValidation = (req, res, next) => {
   

    if (req.params.page<0) {
        req.params.page=0;
        
    } 
    if (req.params.pageSize<0) {
        req.params.pageSize=20;
        
    } 
    next();
};