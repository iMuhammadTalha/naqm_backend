const moment = require('moment');
const services = require('./services');
const config = require('../../../config');
// const {rand} = require('../../../lib/helper');
// const {sendMessage} = require('../../../lib/otp');
const jwt = require('jsonwebtoken');
const keys = process.env.JWT_TOKEN_SECRET;
const logger = config.logger.createLogger('user/auth/controller');
// const bcrypt = require('bcryptjs');


exports.adminLogin = function (req, res) {

    var userCheck = {
        email: req.body.email,
        password: req.body.password
    };
logger.info('EMAIL');
    if(req.body.email=='iotlab@seecs.edu.pk' && req.body.password=='1234'){
        const payload = {
            id: 1,
            email: 'iotlab@seecs.edu.pk',
            role: 'admin'
        }; // Create JWT Payload
        const token = jwt.sign(payload, keys, {expiresIn: 3600000000000});
        logger.info('Login 200');
        res.status(200).json({
            token: 'Bearer ' + token,
            user: {
                user_id: '1',
                email: 'iotlab@seecs.edu.pk',
                displayName: 'IOT lab',
                role: 'admin'
            }
        });
    } else {
        logger.info('Login 401');

        return res.status(401).send('Password incorrect');
    }
    

    // services.findAdmin(userCheck, function (err, user) {
    //     if (err) res.send(err);
    //     // Check for user
    //     if (user.rowCount === 0) {
    //         return res.status(404).send({msg: 'Admin Email is not exist'});
    //     } else {

    //         // Check Password
    //         bcrypt.compare(userCheck.password, user.rows[0].password).then(isMatch => {
    //             if (isMatch) {
    //                 // User Matched
                    // const payload = {
                    //     id: user.rows[0].id,
                    //     email: user.rows[0].email,
                    //     role: user.rows[0].role
                    // }; // Create JWT Payload
                    // const token = jwt.sign(payload, keys, {expiresIn: 3600000000000});

    //                 var updateAdminJWTToken = {
    //                     jwt: token,
    //                     user_id: user.rows[0].id
    //                 };

    //                 services.updateUserJWTToken(updateAdminJWTToken, function (err, updatedAdminJwtToken) {
    //                     if (err) res.status(400).json({msg: err});
    //                 });

    //                 res.status(200).json({
    //                     token: 'Bearer ' + token,
    //                     user: {
    //                         user_id: user.rows[0].id,
    //                         email: user.rows[0].email,
    //                         displayName: user.rows[0].first_name + ' ' + user.rows[0].last_name,
    //                         role: user.rows[0].role
    //                     }
    //                 });
    //                 // });
    //             } else {
    //                 return res.status(401).send('Password incorrect');
    //             }
    //         });
    //     }
    // });
};

exports.getUserInfoByJWTToken = function (req, res) {

    const bearer = req.body.access_token.split(' ');
    const validUser = jwt.verify(bearer[1], keys);
    if (validUser) {
        res.status(200).json({
            user_id: 1,
            displayName: 'IOT Lab',
            email: 'iotlab@seecs.edu.pk',
            mobile_number: '012345',
            user_type: 'admin',
            role: 'admin'
        });
        // services.isJWTTokenValid(bearer[1], function (err, userJWT) {
        //     if (userJWT.rowCount > 0) {
        //         services.getUserInfo(validUser.id, function (err, user) {
        //             if (err) {
        //                 logger.debug(err);
        //             }
        //             if (user.rowCount > 0) {
        //                 if (user.rows[0].user_type === 'admin') {
        //                     services.getAdminRole(validUser.id, function (err, admin) {
        //                         if (admin.rowCount > 0) {
        //                             res.status(200).json({
        //                                 user_id: user.rows[0].id,
        //                                 displayName: user.rows[0].first_name + ' ' + user.rows[0].last_name,
        //                                 email: user.rows[0].email,
        //                                 mobile_number: user.rows[0].mobile_number,
        //                                 user_type: user.rows[0].user_type,
        //                                 role: admin.rows[0].role
        //                             });
        //                         } else {
        //                             res.status(200).json({
        //                                 user_id: user.rows[0].id,
        //                                 displayName: user.rows[0].first_name + ' ' + user.rows[0].last_name,
        //                                 email: user.rows[0].email,
        //                                 mobile_number: user.rows[0].mobile_number,
        //                                 user_type: user.rows[0].user_type,
        //                                 role: user.rows[0].user_type
        //                             });
        //                         }
        //                     });
        //                 } else {
        //                     res.status(200).json({
        //                         user_id: user.rows[0].id,
        //                         displayName: user.rows[0].first_name + ' ' + user.rows[0].last_name,
        //                         email: user.rows[0].email,
        //                         mobile_number: user.rows[0].mobile_number,
        //                         user_type: user.rows[0].user_type,
        //                         role: user.rows[0].user_type
        //                     });
        //                 }
        //             } else {
        //                 return res.status(404).send({msg: 'User not exist against this JWT'});
        //             }
        //         });
        //     } else {
        //         return res.status(404).send({msg: 'Invalid JWT'});
        //     }
        // });
    } else {
        return res.status(404).send('Invalid JWT Token');
    }
};