const {Pool, Client} = require('pg');
require('dotenv').config();

const PGHOST=localhost
const PGUSER=postgres
const PGDATABASE=naqm
const PGPASSWORD='MTalha@381'
const PGPORT=5432

const connectionString = 'postgresql://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_PORTDB_DATABASE;
// const connectionString = 'postgresql://' + PGUSER + ':' + PGPASSWORD + '@' + PGHOST + ':' + PGPORT + '/' + PGDATABASE;
// const connectionString='postgresql://postgres:MTalha@381@postgres:5432/postgres'

const connection = new Client({
    connectionString: connectionString
});

connection.connect();

module.exports = {
    connection
};

const pool = new Pool();

pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT * FROM users WHERE id = $1', [1], (err, res) => {
        done();
        if (err) {
            console.log(err.stack);
        } else {
            console.log(res.rows[0]);
        }
    });
});

