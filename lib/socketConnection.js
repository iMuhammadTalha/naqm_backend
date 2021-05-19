const services = require('./services');
const config = require('../config');
const logger = config.logger.createLogger('lib/socketConnection');
const jwt = require('jsonwebtoken');
const keys = process.env.JWT_TOKEN_SECRET;
let socketExport = null;


let isTokenValid = (token, socketId) => {
    // return true;
    if (token && socketId) {
        const bearer = token.split(' ');
        try {
            const validUser = jwt.verify(bearer[1], keys);
            if (validUser) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            logger.debug('Error in token', err);
        }
    }
};

module.exports = (server, io) => {
    io = require('socket.io')(server, {
        transport: ['websocket'],

    });
    // middleware to verify on Connecting and Reconnecting
    io.use((socket, next) => {
        let token = socket.handshake.query.token;
        let socketId = socket.id;
        if (isTokenValid(token, socketId)) {
            return next();
        }
        return next(new Error('authentication error'));
    });

    io.on('connection', function (socket) {


        // Saving socket ID in DB
        let token = socket.handshake.query.token;
        let socketId = socket.id;
        const bearer = token.split(' ');
        const validUser = jwt.verify(bearer[1], keys);
        if (validUser) {
            services.saveUserSocketId(validUser.id, socketId, function (err, affectedRows) {
                if (err) {
                    socket.emit('errorMsg', {
                        msg: 'Error in saving user socket ID',
                        socketMessage: 'connection'
                    });
                }
                if (affectedRows > 0) {
                    logger.debug('socket ID updated:', validUser.user_type, socket.id);
                } else {
                    logger.debug('socket ID not updated:', validUser.user_type);
                }
            });
        }
        logger.debug('connected', validUser.id, validUser.mobile_number);


        // Files in which socket is used.
        require('../app/rides/book-ride')(socket);
        require('../app/chat/ride-chat')(socket);


        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
            logger.debug('Disconnected', socket.id);
        });

    });

    return io;
};

