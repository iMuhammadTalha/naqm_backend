const {readFileSync} = require('fs');

const initServer = async (config, app) => {
    const logger = config.logger.createLogger('initServer');

    try {
        const serverObject = {};

        if (config.app.server.protocol === 'https') {
            //https server
            const https = require('https');

            // loading SSL certificates
            serverObject.server = https.createServer(
                {
                    key: readFileSync('config/ssl/private.key'),
                    cert: readFileSync('config/ssl/certificate.crt'),
                    ca: readFileSync('config/ssl/ca_bundle.crt')
                },
                app
            );
        } else {
            //http server init
            const http = require('http');
            serverObject.server = http.createServer(app);
        }

        if (config.app.server.socket) {
            //init socket io
            // const socket = require('socket.io');

            if (config.app.server.socket.port) {
                //if port is present then init socket on that port
                // serverObject.io = socket(config.app.server.socket.port);
            } else {
                // else use the provieded server to init the socket
                // serverObject.io = socket(serverObject.server);
            }
        }

        // if (config.app.db) {
        //     //pg db initiaization.
        //     const {Pool} = require('pg');
        //     //if authentication available, then use the following.
        //     const auth = config.app.db.username && config.app.db.password ? {
        //         host: config.app.db.host,
        //         database: config.app.db.database,
        //         port: config.app.db.port,
        //         user: config.app.db.username,
        //         password: config.app.db.password
        //     } : {
        //         host: config.app.db.host,
        //         database: config.app.db.database,
        //         port: config.app.db.port,
        //     };
        //
        //     if (auth) {
        //         const pool = new Pool({
        //             ...auth
        //         });
        //         const connection = pool.connect();
        //         serverObject.connection = connection;
        //     } else {
        //         logger.error('Please provide a valid db values');
        //     }
        // } else {
        //     logger.error('Please provide database information');
        // }

        return serverObject;
    } catch (error) {
        logger.error(error);
    }
};

module.exports = initServer;
