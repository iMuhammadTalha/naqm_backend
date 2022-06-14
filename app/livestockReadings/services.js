const pool = require('../../config/db/db');
const config = require('../../config');
const logger = config.logger.createLogger('AnimalReading/services');

exports.getAllAnimalReading = function (result) {
    const sqlQuery = 'SELECT * FROM "AnimalReading" ORDER BY created_time DESC';
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

exports.getALatestAnimalReading = function (animalID, result) {
    const sqlQuery = `SELECT * FROM "AnimalReading" WHERE animal_id=${animalID} ORDER BY created_time DESC`;
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

exports.getAllAnimalReadingWithPagination = function (page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT id, body_temperature, atmospheric_temperature, atmospheric_humidity, beat_per_min, ax, ay, az, gx, gy, gz, animal_id, to_char(created_time , 'YYYY-MM-DD HH24:MI') AS created_time FROM "AnimalReading" ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "AnimalReading" `;

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

exports.getANodeAllAnimalReadingsWithPagination = function (animalid, page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT id, body_temperature, atmospheric_temperature, atmospheric_humidity, beat_per_min, ax, ay, az, gx, gy, gz, animal_id, to_char(created_time , 'YYYY-MM-DD HH24:MI') AS created_time FROM "AnimalReading" WHERE animal_id= ${animalid} ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "AnimalReading" WHERE node_id= ${nodeid} `;

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

exports.getAllAnimalReadingByAnimal = function getAllAnimalReadingByAnimal(animalID, result) {
    const sqlQuery = `SELECT * FROM AnimalReading WHERE animal_id = '${animalID}'  ORDER BY created_time DESC`;
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
exports.createAnimalReading = function createAnimalReading(AnimalReading, result) {
    try {
        const sqlQuery = `INSERT INTO "AnimalReading"(created_time, body_temperature, atmospheric_temperature, atmospheric_humidity, beat_per_min, ax, ay, az, gx, gy, gz, animal_id) VALUES ( '${AnimalReading.created_date}', '${AnimalReading.body_temperature}', '${AnimalReading.atmospheric_temperature}', '${AnimalReading.atmospheric_humidity}', '${AnimalReading.beat_per_min}', '${AnimalReading.ax}', '${AnimalReading.ay}', '${AnimalReading.az}', '${AnimalReading.gx}', '${AnimalReading.gy}', '${AnimalReading.gz}', '${AnimalReading.animal_id}') RETURNING id`;

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

exports.deleteAnimalReading = function deleteAnimalReading(id, result) {
    try {
        const sqlQuery = `DELETE FROM AnimalReading WHERE id='${id}'`;

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
            FROM public."AnimalReading" 
            WHERE created_time > current_date - interval '10' day AND animal_id=${id} ORDER BY created_time DESC`;

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
        const sqlQuery = `SELECT ROUND(AVG(body_temperature), 2) as body_temperature, ROUND(AVG(atmospheric_temperature), 2) AS atmospheric_temperature, ROUND(AVG(atmospheric_humidity), 2) AS atmospheric_humidity, ROUND(AVG(beat_per_min), 2) AS beat_per_min, ROUND(AVG(ax), 2) AS ax, ROUND(AVG(ay), 2) AS ay, ROUND(AVG(az), 2) AS az, ROUND(AVG(gx), 2) AS gx, ROUND(AVG(gy), 2) AS gy, ROUND(AVG(gz), 2) AS gz
                
            FROM public."AnimalReading" 
            WHERE created_time::date = current_date - interval '${day}' day AND animal_id= '${id}' `;
            
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
            ch4
            FROM public."AnimalReading" 
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


