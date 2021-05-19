const moment = require('moment');
const services = require('./services');
const config = require('../../../config');
const logger = config.logger.createLogger('user/forgetPassword/controller');
const {rand, transporter, emailAddress} = require('../../../lib/helper');
let nodemailer = require('nodemailer');

exports.sendEmail = function(req, res, next) {
    const email = req.body.email;
    // Find user by email
    services.findUserByEmail(email, function(err, user) {
        if (err) {
            logger.error('Error:', err);
            return res.send(err);
        }
        if (user.rowCount===0) {
            return res.status(400).json({
                msg: 'User not found. Wrong email address.'
            });
        }
        const verificationCode = rand(1000, 9999);


        let mailOptions = {
            from: emailAddress,
            to: email,
            subject: 'Buraak Forget Password',
            text: 'Buraak <br>' +
                ' Password Reset <br>' +
                'Hey there!<br>Did you forget your password?<br> Don\'t need to be worry. <br>' +
                'You can reset your account password very easily.<br> '+verificationCode +
                ' <a href=\'".base_url()."/reset_password/".verificationCode. "\'> Click here to reset password </a>' +
                ' <br> If you received that email but you didn\'t forget your account password of Burakk, someone try to use your email. Simply ignore that email. He/she cannot use anymore and your password can\'t change.<br>\n    ' +
                'We hope you get benefits for using our system.<br>' +
                'Sincerely,<br>' +
                'Buraak<br>'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({
            msg: 'Email sent.'
        });

    });
};


exports.sendEmail = function(req, res, next) {
    const email = req.body.email;
    // Find user by email
    services.findUserByEmail(email, function(err, user) {
        if (err) {
            logger.error('Error:', err);
            return res.send(err);
        }
        if (user.rowCount===0) {
            return res.status(400).json({
                msg: 'User not found. Wrong email address.'
            });
        }
        const verificationCode = rand(1000, 9999);


        let mailOptions = {
            from: emailAddress,
            to: email,
            subject: 'Buraak Forget Password',
            text: 'Buraak <br>' +
                ' Password Reset <br>' +
                'Hey there!<br>Did you forget your password?<br> Don\'t need to be worry. <br>' +
                'You can reset your account password very easily.<br> '+verificationCode +
                ' <a href=\'".base_url()."/reset_password/".verificationCode. "\'> Click here to reset password </a>' +
                ' <br> If you received that email but you didn\'t forget your account password of Burakk, someone try to use your email. Simply ignore that email. He/she cannot use anymore and your password can\'t change.<br>\n    ' +
                'We hope you get benefits for using our system.<br>' +
                'Sincerely,<br>' +
                'Buraak<br>'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({
            msg: 'Email sent.'
        });

    });
};
