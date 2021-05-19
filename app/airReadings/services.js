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

exports.getAllAirReadingWithPagination = function (page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY AirReadings.type ASC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY AirReadings.type ASC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT AirReadings.*, services.name AS service_name FROM AirReadings LEFT JOIN services ON services.id=AirReadings.service_id ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM AirReadings LEFT JOIN services ON services.id=AirReadings.service_id `;

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
    const sqlQuery = `SELECT AirReadings.*, services.name AS service_name FROM AirReadings LEFT JOIN services ON services.id=AirReadings.service_id WHERE service_id = '${serviceID}'  ORDER BY AirReadings.type ASC`;
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
        const sqlQuery = `DELETE FROM AirReadings WHERE id='${id}'`;

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

exports.updateAirReading = function updateAirReading(id, AirReading, result) {
    try {
        const sqlQuery = `UPDATE AirReadings SET type='${AirReading.type}', service_id='${AirReading.service_id}', model='${AirReading.model}', color='${AirReading.color}' WHERE id= '${id}'`;

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