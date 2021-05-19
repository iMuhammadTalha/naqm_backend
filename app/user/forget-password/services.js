
const pool = require('../../../config/db/db');
const config = require('../../../config');
const logger = config.logger.createLogger('user/fleet/services');

exports.findUserByEmail = function( email, result) {
    const sqlQuery = `SELECT users.* FROM users WHERE users.email= '${email}' AND user_type='admin' OR user_type='fleet' `;
    try {
        pool.query( sqlQuery, [], (err, res) => {
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

exports.updateForgetPassword = function updateForgetPassword(jwtData, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`UPDATE user_jwt SET jwt='${jwtData.jwt}' WHERE user_id= '${jwtData.user_id}'`, (err, res) => {
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