const pool = require('../../config/db/db');
const config = require('../../config');
const logger = config.logger.createLogger('FarmBotReading/services');

exports.getAllFarmBotReading = function (result) {
    const sqlQuery = 'SELECT * FROM "FarmBotReading" ORDER BY created_time DESC';
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

exports.getALatestFarmBotReading = function (nodeID, result) {
    const sqlQuery = `SELECT * FROM "FarmBotReading" WHERE node_id=${nodeID} ORDER BY created_time DESC`;
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

exports.getAllFarmBotReadingWithPagination = function (page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT id, nitrogen, phosphorus, potassium, soil_moisture, node_id, to_char(created_time , 'YYYY-MM-DD HH24:MI') AS created_time FROM "FarmBotReading" ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "FarmBotReading" `;

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

exports.getANodeAllFarmBotReadingsWithPagination = function (nodeId, page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT id, nitrogen, phosphorus, potassium, soil_moisture, node_id, to_char(created_time , 'YYYY-MM-DD HH24:MI') AS created_time FROM "FarmBotReading" WHERE node_id= ${nodeId} ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "FarmBotReading" WHERE node_id= ${nodeid} `;

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

exports.getAllFarmBotReadingByFarmBot = function getAllFarmBotReadingByFarmBot(nodeID, result) {
    const sqlQuery = `SELECT * FROM FarmBotReading WHERE node_id = '${nodeID}'  ORDER BY created_time DESC`;
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
exports.createFarmBotReading = function createFarmBotReading(FarmBotReading, result) {
    try {
        const sqlQuery = `INSERT INTO "FarmBotReading"(created_time, nitrogen, phosphorus, potassium, soil_moisture, node_id) VALUES ( '${FarmBotReading.created_date}', '${FarmBotReading.nitrogen}', '${FarmBotReading.phosphorus}', '${FarmBotReading.potassium}', '${FarmBotReading.soil_moisture}', '${FarmBotReading.node_id}') RETURNING id`;

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

exports.deleteFarmBotReading = function deleteFarmBotReading(id, result) {
    try {
        const sqlQuery = `DELETE FROM FarmBotReading WHERE id='${id}'`;

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
        const sqlQuery = `
        SELECT DISTINCT TO_CHAR(created_time::date, 'YYYY-MM-DD') AS created_time
        FROM public."FarmBotReading"
    ORDER BY created_time DESC
            LIMIT 10
        `;

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

exports.getAvgValuesdatesAsync = function(date) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT ROUND(AVG(nitrogen), 2) as nitrogen, ROUND(AVG(phosphorus), 2) AS phosphorus, ROUND(AVG(potassium), 2) AS potassium, ROUND(AVG(soil_moisture), 2) AS soil_moisture
            FROM public."FarmBotReading" 
            WHERE created_time::date = '${date}' `;
            
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

exports.get11lastvalues = function(id, result) {
    try {
        const sqlQuery = `SELECT
        id, nitrogen, phosphorus, potassium, soil_moisture, node_id
            FROM public."FarmBotReading" 
            WHERE node_id=${id} ORDER BY created_time DESC LIMIT 11`;

        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                logger.error(res.rows);
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};


