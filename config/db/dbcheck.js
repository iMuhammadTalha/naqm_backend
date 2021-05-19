'use strict';

/*
This module handles database initialization
*/

const {Pool} = require('pg');
require('dotenv').config();

let db = new Pool();

function listTables(callback) {
    db.connect((err, connection) => {
        if (err) {
            if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                err = new Error('Could not access the database. Check Postgres config and authentication credentials');
            }
            if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
                err = new Error('Could not connect to the database. Check Postgres host and port configuration');
            }
            callback(err);
        }

        let query = 'SELECT table_name\n' +
            '  FROM information_schema.tables\n' +
            ' WHERE table_schema=\'public\'\n' +
            '   AND table_type=\'BASE TABLE\';';

        connection.query(query, (err) => {
            connection.release();
            if (err) {
                callback(err);
            }
            callback(null);
        });
    });
}

function runUpdates(callback) {
    listTables((err) => {
        if (err) {
            callback(err);
        }

        callback(null);
    });
}

module.exports = callback => {
    runUpdates(err => {
        if (err) {
            callback(err);
        }
        db.end(() => {
            callback(null);
        });
    });
};
