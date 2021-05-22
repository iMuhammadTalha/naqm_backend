const pool = require('../../config/db/db');
const config = require('../../config/index.js');
const logger = config.logger.createLogger('user/services');

exports.getAllUsers = function getAllUsers(result) {
    const sqlQuery = `SELECT * FROM Users WHERE isDelete='false'`;
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

exports.createUser = function createUser(user, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`INSERT INTO Users ( mobile_number, email, profile_pic, created_date, user_type, updated_at) VALUES ( '${user.mobile_number}', '${user.email}', '${user.profile_pic}', '${user.created_date}', '${user.user_type}', '${user.updated_at}')`, (err, res) => {
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
        logger.error('ERROR', error);
    }
};

exports.deleteUser = function deleteUser(id, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`DELETE FROM Users WHERE id = '${id}'`, (err, res) => {
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

exports.updateUser = function updateUser(id, user, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`UPDATE Users SET mobile_number='${user.mobile_number}', email='${user.email}',  user_type='${user.user_type}', updated_at='${user.updated_at}' WHERE id= '${id}'`, (err, res) => {
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
exports.isAlreadyMobileExsists = function isAlreadyMobileExsists(mobileNumber, result) {
    const sqlQuery = `SELECT * FROM users WHERE users.mobile_number='${mobileNumber}'`;
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
exports.isAlreadyEmailExsists = function isAlreadyEmailExsists(email, result) {
    const sqlQuery = `SELECT * FROM users WHERE users.email='${email}'`;
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