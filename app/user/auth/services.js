const moment = require('moment');
const config = require('../../../config');
const logger = config.logger.createLogger('user/auth/service');
const pool = require('../../../config/db/db');

// exports.update
exports.getAUser = function (mobile, result) {
    const sqlQuery = `SELECT users.*, user_otp.otp, user_otp.created_date FROM users LEFT JOIN user_otp ON users.id=user_otp.user_id WHERE mobile_number = '${mobile}'`;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.findUserWithOTP = function findUserWithOTP(user, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }

            client.query(`SELECT * FROM users WHERE mobile_number = '${user.mobile_number}'`, (err, res) => {
                // client.query(`DELETE FROM admin_profile WHERE id = '${id}'`, (err, res) => {

                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else if (res.rowCount > 0) {

                    client.query(`SELECT * FROM user_otp WHERE user_id= '${res.rows[0].id}' AND otp= '${user.otp}'`, (err, res2) => {
                        release();
                        if (err) {
                            logger.error('Error: ', err.stack);
                            result(err, null);
                        } else if (res2.rowCount > 0) {
                            result(null, res);
                        } else {
                            result(null, res2);
                        }
                    });
                } else {
                    result(null, res);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }


};

exports.findDriverWithOTP = function findDriverWithOTP(user, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }

            client.query(`SELECT users.*, driver_profile.verified FROM users LEFT JOIN driver_profile ON driver_profile.user_id=users.id WHERE mobile_number = '${user.mobile_number}'`, (err, res) => {
                // client.query(`DELETE FROM admin_profile WHERE id = '${id}'`, (err, res) => {

                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else if (res.rowCount > 0) {

                    client.query(`SELECT * FROM user_otp WHERE user_id= '${res.rows[0].id}' AND otp= '${user.otp}'`, (err, res2) => {
                        release();
                        if (err) {
                            logger.error('Error: ', err.stack);
                            result(err, null);
                        } else if (res2.rowCount > 0) {
                            result(null, res);
                        } else {
                            result(null, res2);
                        }
                    });
                } else {
                    result(null, res);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.updateUserOTPCode = function updateUserOTPCode(otpInfo, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }

            client.query(`SELECT * FROM users WHERE mobile_number = '${otpInfo.mobile_number}'`, (err, res) => {

                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {

                    client.query(`UPDATE user_otp SET otp='${otpInfo.otp}', created_date='${otpInfo.created_date}' WHERE user_id= '${res.rows[0].id}'`, (err, res) => {
                        if (err) {
                            logger.error('Error: ', err.stack);
                            result(err, null);
                        } else {
                            release();

                            result(null, res);
                        }
                    });
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.createAppUser = function createAppUser(user, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`INSERT INTO Users ( mobile_number, created_date, user_type, updated_at) VALUES ( '${user.mobile_number}', '${user.todayDate}', '${user.user_type}', '${user.todayDate}') RETURNING id`, (err, res) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    let appUserQuery = `INSERT INTO app_user_profile( user_id) VALUES ('${res.rows[0].id}')`;
                    let userOTPQuery = `INSERT INTO user_otp( user_id, otp, created_date, method) VALUES ('${res.rows[0].id}', '${user.otp}', '${user.todayDate}', '${user.method}')`;
                    let deviceInfoQuery = `INSERT INTO device_info( user_id) VALUES ('${res.rows[0].id}')`;
                    let lastLoginQuery = `INSERT INTO last_login( user_id) VALUES ('${res.rows[0].id}')`;
                    let userJWTQuery = `INSERT INTO user_jwt( user_id) VALUES ('${res.rows[0].id}')`;
                    let userSocketQuery = `INSERT INTO user_socket( user_id) VALUES ('${res.rows[0].id}')`;
                    let userWalletQuery = `INSERT INTO wallet( user_id, amount) VALUES ('${res.rows[0].id}', 0)`;

                    client.query(appUserQuery, (err, res2) => {
                        if (err) {
                            logger.error('Error: ', err.stack);
                            result(err, null);
                        }
                        client.query(userOTPQuery, (err, res3) => {
                            if (err) {
                                logger.error('Error: ', err.stack);
                                result(err, null);
                            }
                            client.query(lastLoginQuery, (err, res4) => {
                                if (err) {
                                    logger.error('Error: ', err.stack);
                                    result(err, null);
                                }
                                client.query(deviceInfoQuery, (err, res5) => {
                                    if (err) {
                                        logger.error('Error: ', err.stack);
                                        result(err, null);
                                    }
                                    client.query(userJWTQuery, (err, res6) => {
                                        if (err) {
                                            logger.error('Error: ', err.stack);
                                            result(err, null);
                                        }
                                        client.query(userSocketQuery, (err, res7) => {
                                            if (err) {
                                                logger.error('Error: ', err.stack);
                                                result(err, null);
                                            }
                                            client.query(userWalletQuery, (err, res8) => {
                                                if (err) {
                                                    logger.error('Error: ', err.stack);
                                                    result(err, null);
                                                }
                                                release();
                                                result(null, res);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            });
        });
    } catch (error) {
        logger.error('ERROR', error);
    }
};

exports.updateUserJWTToken = function updateUserJWTToken(jwtInfo, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`UPDATE user_jwt SET jwt='${jwtInfo.jwt}', fcm='${jwtInfo.fcm}' WHERE user_id= '${jwtInfo.user_id}'`, (err, res) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    release();
                    result(null, res.rowCount);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.updateUserDeviceInfo = function (deviceInfo, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`UPDATE device_info SET device_type='${deviceInfo.device_type}' WHERE user_id= '${deviceInfo.user_id}'`, (err, res) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    release();
                    result(null, res.rowCount);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.updateFacebookAccessToken = function updateFacebookAccessToken(user, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`UPDATE app_user_profile SET facebook_access_token='${user.access_token}' WHERE user_id= '${user.user_id}'`, (err, res) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    release();
                    result(null, res.rowCount);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.findAdmin = function findAdmin(user, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }

            client.query(`SELECT users.*, admin_profile.password, admin_profile.role FROM users JOIN admin_profile ON admin_profile.user_id=users.id WHERE users.email = '${user.email}'`, (err, res) => {

                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    release();
                    result(null, res);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getUserInfo = function getUserInfo(id, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }

            client.query(`SELECT users.id, users.mobile_number, users.email, users.first_name, users.last_name, users.user_type FROM users WHERE users.id = '${id}'`, (err, res) => {

                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    release();
                    result(null, res);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.isJWTTokenValid = function isJWTTokenValid(token, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }

            client.query(`SELECT * FROM user_jwt WHERE jwt = '${token}'`, (err, res) => {

                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    release();
                    result(null, res);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getUserInfo = function getUserInfo(id, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }

            client.query(`SELECT users.id, users.mobile_number, users.email, users.first_name, users.last_name, users.user_type FROM users WHERE users.id = '${id}'`, (err, res) => {

                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    release();
                    result(null, res);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getAdminRole = function getAdminRole(id, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }

            client.query(`SELECT role FROM admin_profile WHERE user_id = '${id}'`, (err, res) => {

                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    release();
                    result(null, res);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getADriverUser = function (mobile, result) {
    const sqlQuery = `SELECT users.*, driver_profile.verified FROM users JOIN driver_profile ON users.id=driver_profile.user_id WHERE mobile_number = '${mobile}' AND user_type='driver'`;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};