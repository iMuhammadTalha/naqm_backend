const path = require('path');
const config = require(path.resolve(
    require.cache.userObject.appPath,
    'config/index.js'
));
require('dotenv').config();
const {Pool} = require('pg');

const pool = new Pool();

const logger = config.logger.createLogger('PG');

module.exports = {
    query: (text, params, callback) => {
        const start = Date.now();
        return pool.query(text, params, (err, res) => {
            const duration = Date.now() - start;
            if (res) {
                logger.info('Executed query', {text, duration, rows: res.rowCount});
            } else {
                logger.info('Executed query', {text});
            }
            callback(err, res);
        });
    },

    getClient: (callback) => {
        pool.connect((err, client, done) => {
            const query = client.query;
            // monkey patch the query method to keep track of the last query executed
            client.query = (...args) => {
                client.lastQuery = args;
                return query.apply(client, args);
            };

            // set a timeout of 5 seconds, after which we will log this client's last query
            const timeout = setTimeout(() => {
                logger.error('A client has been checked out for more than 5 seconds!');
                logger.error(`The last executed query on this client was: ${client.lastQuery}`);
                release();
            }, 5000);

            const release = (err) => {
                // call the actual 'done' method, returning this client to the pool
                done(err);
                // clear our timeout
                clearTimeout(timeout);
                // set the query method back to its old un-monkey-patched version
                client.query = query;
            };
            callback(err, client, release);
        });
    }
};