const pool = require('../../../config/db/db');
const config = require('../../../config');
const logger = config.logger.createLogger('user/admin/services');
const moment = require('moment');

exports.getAllAdminsProfile = function getAllAdminsProfile(result) {
    const sqlQuery = `SELECT users.*, admin_profile.role FROM admin_profile LEFT JOIN users ON admin_profile.user_id = users.id WHERE users.isDelete='false'`;
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

exports.getAAdminProfile = function(id, result) {
    const sqlQuery = `SELECT users.*, admin_profile.role, admin_profile.id AS admin_id FROM admin_profile LEFT JOIN users ON admin_profile.user_id = users.id WHERE users.isDelete='false' AND users.id='${id}'`;
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

exports.getAAdminCities = function(id, result) {
    const sqlQuery = `SELECT cities.id AS id, city AS city FROM admin_cities JOIN admin_profile ON admin_cities.admin_id = admin_profile.id JOIN cities ON cities.id = admin_cities.city_id WHERE admin_cities.admin_id='${id}'`;
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

exports.findAdminByEmail = function findAdminByEmail(email, result) {
    const sqlQuery = `SELECT users.*, admin_profile.password, admin_profile.role FROM users LEFT JOIN admin_profile ON admin_profile.user_id = users.id WHERE users.email= '${email}' `;
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
exports.updateAdminJWTToken = function updateAdminJWTToken(jwtInfo, result) {

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`UPDATE user_jwt SET jwt='${jwtInfo.jwt}' WHERE user_id= '${jwtInfo.user_id}'`, (err, res) => {
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
exports.createAdminProfile = function createAdminProfile(user, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`INSERT INTO Users ( mobile_number, email, profile_pic, created_date, user_type, first_name, last_name, updated_at) VALUES ( '${user.mobile_number}', '${user.email}', '${user.profile_pic}', '${user.created_date}', '${user.user_type}', '${user.first_name}', '${user.last_name}', '${user.updated_at}') RETURNING id`, (err, res) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    client.query(`INSERT INTO public.admin_profile( user_id, role, password) VALUES ('${res.rows[0].id}', '${user.role}', '${user.password}') RETURNING id`, (err, res2) => {
                        let deviceInfoQuery = `INSERT INTO device_info( user_id) VALUES ('${res.rows[0].id}')`;
                        let lastLoginQuery = `INSERT INTO last_login( user_id) VALUES ('${res.rows[0].id}')`;
                        let userJWTQuery = `INSERT INTO user_jwt( user_id) VALUES ('${res.rows[0].id}')`;

                        if (err) {
                            logger.error('Error: ', err.stack);
                            result(err, null);
                        } else {
                            if(user.adminCity){
                                for(let i=0;i< user.adminCity.length; i++){
                                    let adminCityQuery = `INSERT INTO admin_cities( admin_id, city_id) VALUES ('${res2.rows[0].id}','${user.adminCity[i].id}')`;
                                    client.query(adminCityQuery, (err, res6) => {
                                        if (err) {
                                            logger.error('Error: ', err.stack);
                                            result(err, null);
                                        }
                                    });
                                }
                            }
                            client.query(lastLoginQuery, (err, res3) => {
                                if (err) {
                                    logger.error('Error: ', err.stack);
                                    result(err, null);
                                }
                                client.query(deviceInfoQuery, (err, res4) => {
                                    if (err) {
                                        logger.error('Error: ', err.stack);
                                        result(err, null);
                                    }
                                    client.query(userJWTQuery, (err, res5) => {
                                        if (err) {
                                            logger.error('Error: ', err.stack);
                                            result(err, null);
                                        }
                                        release();
                                        result(null, res.rowCount);
                                    });
                                });
                            });
                        }
                    });
                }
            });
        });
    } catch (error) {
        logger.error('ERROR', error);
    }
};

exports.deleteAdminProfile = function deleteAdminProfile(id, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }

            client.query(`UPDATE Users SET isDelete='true' WHERE id = '${id}'`, (err, res2) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    release();
                    result(null, res2.rowCount);
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.updateAdminProfile = function updateAdminProfile(id, user, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`UPDATE Users SET profile_pic='${user.profile_pic}', updated_at='${user.updated_at}', first_name='${user.first_name}', last_name='${user.last_name}' WHERE id= '${id}'`, (err, res) => {
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

exports.getTotalRides = function (time, adminCities, result) {

    let searchQuery = '';
    let fromDate = '', toDate = '';
    if (time === 'today') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
    } else if (time === 'yesterday') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last7Days') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisMonth') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastMonth') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last3Month') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(4, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisYear') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastYear') {
        toDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'years').format('YYYY-MM-DD 00:00:00');
    } else {
        searchQuery = '';
    }
    if (toDate === '' && fromDate === '') {
        searchQuery = '';
    } else {
        searchQuery = `WHERE rides.start_time BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    if(adminCities){
        if(searchQuery===''){
            searchQuery = `WHERE rides.city_id IN (${adminCities})`;
        } else {
            searchQuery += `AND rides.city_id IN (${adminCities})`;
        }
    }
    const sqlQuery = `SELECT COUNT(*) As COUNT FROM rides ${searchQuery}`;
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

exports.getTotalCompletedRides = function (time, adminCities, result) {

    let searchQuery = '';
    let fromDate = '', toDate = '';
    if (time === 'today') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
    } else if (time === 'yesterday') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last7Days') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisMonth') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastMonth') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last3Month') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(4, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisYear') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastYear') {
        toDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'years').format('YYYY-MM-DD 00:00:00');
    } else {
        searchQuery = '';
    }
    if (toDate === '' && fromDate === '') {
        searchQuery = '';
    } else {
        searchQuery = `AND rides.start_time BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    if(adminCities){
        if(searchQuery===''){
            searchQuery = `AND rides.city_id IN (${adminCities})`;
        } else {
            searchQuery += `AND rides.city_id IN (${adminCities})`;
        }
    }
    const sqlQuery = `SELECT COUNT(*) As COUNT FROM rides WHERE (rides.status='completed' OR rides.status='paymentCompleted') ${searchQuery}`;
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

exports.getTotalRevenue = function (time, adminCities, result) {
    let searchQuery = '';
    let fromDate = '', toDate = '';
    if (time === 'today') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
    } else if (time === 'yesterday') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last7Days') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisMonth') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastMonth') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last3Month') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(4, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisYear') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastYear') {
        toDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'years').format('YYYY-MM-DD 00:00:00');
    } else {
        searchQuery = '';
    }
    if (toDate === '' && fromDate === '') {
        searchQuery = '';
    } else {
        searchQuery = `AND rides.start_time BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    if(adminCities){
        if(searchQuery===''){
            searchQuery = `WHERE rides.city_id IN (${adminCities})`;
        } else {
            searchQuery += `AND rides.city_id IN (${adminCities})`;
        }
    }
    const sqlQuery = `SELECT SUM(buraak_commission+insurance_fee)::integer As total_fare FROM ride_bill JOIN rides ON rides.id=ride_bill.ride_id WHERE ride_bill.status='paid' AND (rides.status='paymentCompleted' OR rides.status='completed' OR rides.status='cancelled') ${searchQuery}`;
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

exports.getTotalEarning = function (time, adminCities, result) {
    let searchQuery = '';
    let fromDate = '', toDate = '';
    if (time === 'today') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
    } else if (time === 'yesterday') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last7Days') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisMonth') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastMonth') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last3Month') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(4, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisYear') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastYear') {
        toDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'years').format('YYYY-MM-DD 00:00:00');
    } else {
        searchQuery = '';
    }
    if (toDate === '' && fromDate === '') {
        searchQuery = '';
    } else {
        searchQuery = `AND rides.start_time BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    if(adminCities){
        if(searchQuery===''){
            searchQuery = `WHERE rides.city_id IN (${adminCities})`;
        } else {
            searchQuery += `AND rides.city_id IN (${adminCities})`;
        }
    }
    const sqlQuery = `SELECT SUM(total_fare)::integer As total_fare FROM ride_bill JOIN rides ON rides.id=ride_bill.ride_id WHERE ride_bill.status='paid' AND (rides.status='paymentCompleted' OR rides.status='completed') ${searchQuery}`;
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

exports.getTotalServices = function (result) {
    const sqlQuery = 'SELECT COUNT(*) As COUNT FROM services';
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

exports.getTotalCancelledRides = function (time, adminCities, result) {
    let searchQuery = '';
    let fromDate = '', toDate = '';
    if (time === 'today') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
    } else if (time === 'yesterday') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last7Days') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisMonth') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastMonth') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last3Month') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(4, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisYear') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastYear') {
        toDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'years').format('YYYY-MM-DD 00:00:00');
    } else {
        searchQuery = '';
    }
    if (toDate === '' && fromDate === '') {
        searchQuery = '';
    } else {
        searchQuery = `AND rides.start_time BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    if(adminCities){
        if(searchQuery===''){
            searchQuery = `WHERE rides.city_id IN (${adminCities})`;
        } else {
            searchQuery += `AND rides.city_id IN (${adminCities})`;
        }
    }
    const sqlQuery = `SELECT COUNT(*) As COUNT FROM rides WHERE rides.status='cancelled' ${searchQuery}`;
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

exports.getTotalUserCancelledRides = function (time, adminCities, result) {
    let searchQuery = '';
    let fromDate = '', toDate = '';
    if (time === 'today') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
    } else if (time === 'yesterday') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last7Days') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisMonth') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastMonth') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last3Month') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(4, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisYear') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastYear') {
        toDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'years').format('YYYY-MM-DD 00:00:00');
    } else {
        searchQuery = '';
    }
    if (toDate === '' && fromDate === '') {
        searchQuery = '';
    } else {
        searchQuery = `AND rides.start_time BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    if(adminCities){
        if(searchQuery===''){
            searchQuery = `WHERE rides.city_id IN (${adminCities})`;
        } else {
            searchQuery += `AND rides.city_id IN (${adminCities})`;
        }
    }
    const sqlQuery = `SELECT COUNT(*) As COUNT FROM rides LEFT JOIN cancellation ON rides.id=cancellation.ride_id WHERE rides.status='cancelled' AND cancellation.cancelled_by='app_user' ${searchQuery}`;
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

exports.getTotalDriverCancelledRides = function (time, adminCities, result) {
    let searchQuery = '';
    let fromDate = '', toDate = '';
    if (time === 'today') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
    } else if (time === 'yesterday') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last7Days') {
        toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisMonth') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastMonth') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'last3Month') {
        toDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(4, 'months').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'thisYear') {
        toDate = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        fromDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
    } else if (time === 'lastYear') {
        toDate = moment().subtract(1, 'years').format('YYYY-MM-DD 00:00:00');
        fromDate = moment().subtract(2, 'years').format('YYYY-MM-DD 00:00:00');
    } else {
        searchQuery = '';
    }
    if (toDate === '' && fromDate === '') {
        searchQuery = '';
    } else {
        searchQuery = `AND rides.start_time BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    if(adminCities){
        if(searchQuery===''){
            searchQuery = `WHERE rides.city_id IN (${adminCities})`;
        } else {
            searchQuery += `AND rides.city_id IN (${adminCities})`;
        }
    }
    const sqlQuery = `SELECT COUNT(*) As COUNT FROM rides LEFT JOIN cancellation ON rides.id=cancellation.ride_id WHERE rides.status='cancelled' AND cancellation.cancelled_by='driver' ${searchQuery}`;
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

exports.getTotalDrivers = function (adminCities, result) {
    let searchQuery='';
    if(adminCities){
        searchQuery = `AND driver_profile.city_id IN (${adminCities})`;    
    }
    const sqlQuery = `SELECT COUNT(*) As COUNT FROM users JOIN driver_profile ON users.id=driver_profile.user_id WHERE driver_profile.verified!='banned' AND users.isDelete='false' ${searchQuery} `;
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

exports.getRecentCompletedRides = function (adminCities, result) {
    let searchQuery='';
    if(adminCities){
        searchQuery = `AND rides.city_id IN (${adminCities})`;    
    }
    const sqlQuery = `SELECT rides.id, rides.service_id, cancelled_by, rides.status, app_user_id, driver_id, distance_km, to_char((start_time at time zone 'pkt'), 'YYYY-MM-DD HH24:MI:ss') AS start_time, to_char((end_time at time zone 'pkt'), 'YYYY-MM-DD HH24:MI:ss') AS end_time, pickup, dropoff, pickup_location, dropoff_location, distance_points, driver.mobile_number AS driver_mobile, driver.first_name  AS driver_firstName, driver.last_name AS driver_lastName, driver.email AS driver_email, appUser.mobile_number AS appUser_mobile, appUser.first_name AS appUser_firstName, appUser.last_name AS appUser_lastName, appUser.email AS appUser_email, ride_bill.total_fare AS fares, services.name AS service_name FROM rides JOIN ride_bill ON ride_bill.ride_id=rides.id JOIN services ON services.id=rides.service_id JOIN users AS driver ON rides.driver_id=driver.id JOIN users AS appUser ON rides.app_user_id=appUser.id WHERE (rides.status='paymentCompleted' OR rides.status='completed') ${searchQuery} ORDER BY id DESC LIMIT 50`;
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

exports.getRecentCancelledRides = function (adminCities, result) {
    let searchQuery='';
    if(adminCities){
        searchQuery = `AND rides.city_id IN (${adminCities})`;    
    }
    const sqlQuery = `SELECT rides.id, rides.service_id, cancelled_by, rides.status, app_user_id, driver_id, distance_km, to_char((start_time at time zone 'pkt'), 'YYYY-MM-DD HH24:MI:ss') AS start_time, to_char((end_time at time zone 'pkt'), 'YYYY-MM-DD HH24:MI:ss') AS end_time, pickup, dropoff, pickup_location, dropoff_location, distance_points, driver.mobile_number AS driver_mobile, driver.first_name  AS driver_firstName, driver.last_name AS driver_lastName, driver.email AS driver_email, appUser.mobile_number AS appUser_mobile, appUser.first_name AS appUser_firstName, appUser.last_name AS appUser_lastName, appUser.email AS appUser_email, ride_bill.total_fare AS fares, services.name AS service_name FROM rides JOIN ride_bill ON ride_bill.ride_id=rides.id JOIN services ON services.id=rides.service_id JOIN users AS driver ON rides.driver_id=driver.id JOIN users AS appUser ON rides.app_user_id=appUser.id WHERE rides.status='cancelled' ${searchQuery} ORDER BY id DESC LIMIT 10`;
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

exports.getOnboardingDrivers = function (adminCities, result) {
    let searchQuery='';
    if(adminCities){
        searchQuery = `AND driver_profile.city_id IN (${adminCities})`;    
    }
    const sqlQuery = `SELECT driver_profile.cnic, driver_profile.car_number, driver_profile.status, driver_profile.priority, driver_profile.cnic_picture_front, driver_profile.cnic_picture_back, driver_profile.driving_license, driver_profile.vehicle_copy, driver_profile.verified, users.*, vehicles.type AS vehicle, vehicles.model, services.type AS service, wallet.amount FROM users JOIN driver_profile ON driver_profile.user_id = users.id JOIN vehicles ON vehicles.id = driver_profile.vehicle_id JOIN services ON services.id = vehicles.service_id JOIN wallet ON wallet.user_id = users.id WHERE users.isDelete='false' AND driver_profile.verified='onBoarding' ${searchQuery} ORDER BY id DESC LIMIT 10`;
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

exports.getTopDrivers = function (result) {
    const sqlQuery = `SELECT driver_profile.cnic, driver_profile.car_number, driver_profile.status, driver_profile.priority, driver_profile.cnic_picture_front, driver_profile.cnic_picture_back, driver_profile.driving_license, driver_profile.vehicle_copy, driver_profile.verified, users.*, vehicles.type AS vehicle, vehicles.model, services.type AS service, wallet.amount FROM users JOIN driver_profile ON driver_profile.user_id = users.id JOIN vehicles ON vehicles.id = driver_profile.vehicle_id JOIN services ON services.id = vehicles.service_id JOIN wallet ON wallet.user_id = users.id WHERE users.isDelete='false' AND driver_profile.verified='onBoarding'`;
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

exports.deleteAAdminCities = function (id, result) {
    
    let adminCityQuery = `DELETE FROM admin_cities WHERE admin_id = '${id}'`;
    try {
        pool.query(adminCityQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rowCount);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.addAdminCity = function (adminId, cityId, result){
    let adminCityQuery = `INSERT INTO admin_cities(admin_id, city_id) VALUES ('${adminId}','${cityId}')`;
    try {
        pool.query(adminCityQuery, [], (err, res) => {
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
}

exports.getUsersOTPbyPhoneNumber = function (phone_number, page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY user_otp.created_date DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY user_otp.created_date DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    let searchQuery = '';
    if(phone_number !== 'Undefined' && phone_number !== 'undefined') {
        searchQuery = ` AND users.mobile_number LIKE '%${phone_number}%' `;
    }
    
    const sqlQuery = `SELECT users.id, 
    users.email, 
    users.first_name,
    users.last_name,
    users.mobile_number,

    user_otp.id AS user_otp_id,
    user_otp.otp,
    to_char((user_otp.created_date at time zone 'pkt'), 'YYYY-MM-DD HH24:MI:ss') AS otp_date
    
    FROM users
    LEFT OUTER JOIN user_otp ON users.id = user_otp.user_id
    WHERE (users.user_type='driver' OR users.user_type='app_user') AND user_otp.otp IS NOT NULL
    ${searchQuery}
    ${sortingQuery} 
    LIMIT ${pageSize} 
    OFFSET ${page * pageSize} `;

    const sqlCountQuery = `
	SELECT COUNT(*) as count 
	
    FROM users
    LEFT OUTER JOIN user_otp ON users.id = user_otp.user_id
    WHERE (users.user_type='driver' OR users.user_type='app_user') AND user_otp.otp IS NOT NULL
    ${searchQuery}
    `;

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(sqlQuery, (err, res) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    client.query(sqlCountQuery, (err, countResponse) => {
                        release();
                        if (err) {
                            logger.error('Error: ', err.stack);
                            result(err, null);
                        } else {
                            let pages = Math.floor(countResponse.rows[0].count / pageSize);
                            if (countResponse.rows[0].count % pageSize > 0) {
                                pages += 1;
                            }
                            const dataToSend = {
                                totalPages: pages,
                                totalCount: countResponse.rows[0].count,
                                records: res.rows
                            };
                            result(null, dataToSend);
                        }
                    });
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};