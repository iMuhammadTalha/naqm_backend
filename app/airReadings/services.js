const pool = require('../../config/db/db');
const config = require('../../config');
const logger = config.logger.createLogger('AirReading/services');

exports.getAllAirReading = function (result) {
    const sqlQuery = 'SELECT * FROM "AirReading" ORDER BY created_time DESC';
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

exports.getALatestAirReading = function (nodeID, result) {
    const sqlQuery = `SELECT * FROM "AirReading" WHERE node_id=${nodeID} ORDER BY created_time DESC`;
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

exports.getAllAirReadingWithPagination = function (page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT id, ch4, co, dust, humidity, latitude, longitude, nh3, no2, node_id, co2, temperature, to_char(created_time , 'YYYY-MM-DD HH24:MI') AS created_time FROM "AirReading" ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "AirReading" `;

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

exports.getANodeAllAirReadingsWithPagination = function (nodeid, page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT id, ch4, co, dust, humidity, latitude, longitude, nh3, no2, node_id, co2, temperature, to_char(created_time , 'YYYY-MM-DD HH24:MI') AS created_time FROM "AirReading" WHERE node_id= ${nodeid} ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "AirReading" WHERE node_id= ${nodeid} `;

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

exports.getAllAirReadingByNode = function getAllAirReadingByNode(nodeID, result) {
    const sqlQuery = `SELECT * FROM AirReading WHERE node_id = '${nodeID}'  ORDER BY created_time DESC`;
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
exports.createAirReading = function createAirReading(AirReading, result) {
    try {
        const sqlQuery = `INSERT INTO "AirReading"(created_time, ch4, co, dust, humidity, latitude, longitude, nh3, no2, node_id, co2, temperature) VALUES ( '${AirReading.created_date}', '${AirReading.ch4}', '${AirReading.co}', '${AirReading.dust}', '${AirReading.humidity}', '${AirReading.latitude}', '${AirReading.longitude}', '${AirReading.nh3}', '${AirReading.no2}', '${AirReading.node_id}', '${AirReading.co2}', '${AirReading.temperature}') RETURNING id`;

        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rowCount);
            }
        });
    } catch (error) {
        logger.error('ERROR', error);
    }
};

exports.deleteAirReading = function deleteAirReading(id, result) {
    try {
        const sqlQuery = `DELETE FROM AirReading WHERE id='${id}'`;

        pool.query(sqlQuery, [], (err, res) => {
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

exports.get10lastdates = function(id, result) {
    try {
        const sqlQuery = `SELECT
            DISTINCT created_time::date AS created_time  
            FROM public."AirReading" 
            WHERE created_time > current_date - interval '10' day AND node_id=${id} ORDER BY created_time DESC`;

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

exports.getAvgValuesdates = function(id, day, result) {
    try {
        const sqlQuery = `SELECT ROUND(AVG(ch4), 2) as ch4, ROUND(AVG(co), 2) AS co, ROUND(AVG(dust), 2) AS dust, ROUND(AVG(humidity), 2) AS humidity, ROUND(AVG(nh3), 2) AS nh3, ROUND(AVG(no2), 2) AS no2, ROUND(AVG(co2), 2) AS co2, ROUND(AVG(temperature), 2) AS temperature
            
            FROM public."AirReading" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' `;

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


exports.getAvgValuesdatesAsync = function(id, day) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT ROUND(AVG(ch4), 2) as ch4, ROUND(AVG(co), 2) AS co, ROUND(AVG(dust), 2) AS dust, ROUND(AVG(humidity), 2) AS humidity, ROUND(AVG(nh3), 2) AS nh3, ROUND(AVG(no2), 2) AS no2, ROUND(AVG(co2), 2) AS co2, ROUND(AVG(temperature), 2) AS temperature
                
            FROM public."AirReading" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' `;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};