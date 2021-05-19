const pool = require('../config/db/db');
const config = require('../config/index.js');
const logger = config.logger.createLogger('lib/services');

exports.isValidJWTToken = function (userId, token, result) {
    const sqlQuery = `SELECT users.*, driver_profile.verified FROM users JOIN user_jwt ON users.id=user_jwt.user_id LEFT JOIN driver_profile ON driver_profile.user_id=users.id WHERE users.id=${userId} AND jwt='${token}'`;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('error: ', err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.isValidDriverOrAppUser = function isValidDriverOrAppUser(mobile, result) {

    const sqlQuery = `SELECT * FROM users WHERE mobile_number='${mobile}'`;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('error: ', err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.isValidAdmin = function isValidAdmin(email, result) {

    const sqlQuery = `SELECT * FROM users WHERE email='${email}'`;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('error: ', err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.deserializeUser = function deserializeUser(id, result) {
    const sqlQuery = `SELECT * FROM users WHERE id='${id}'`;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('error: ', err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.saveUserSocketId = function (userId, socketId, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }

            let query = `UPDATE user_socket SET socket_id='${socketId}' WHERE user_id = '${userId}'`;
            client.query(query, (err, res) => {
                release();
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    result(null, res.rowCount);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getASettings = function (name, result) {

    const sqlQuery = `SELECT * FROM settings WHERE key= '${name}' `;

    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.goDriverOffline = function (id, result) {
    const sqlQuery = `UPDATE driver_profile SET status='offline' WHERE user_id = '${id}' `;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getAdminCities = function (userId, result) {

    const sqlQuery = `SELECT cities.id AS cityId FROM cities JOIN admin_cities ON cities.id=admin_cities.city_id JOIN admin_profile ON admin_profile.id=admin_cities.admin_id WHERE admin_profile.user_id= ${userId} `;

    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};