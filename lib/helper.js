var nodemailer = require('nodemailer');

const emailAddress = 'buraakapp@gmail.com';
const password = 'buraak@123';

exports.rand = function (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};

exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailAddress,
        pass: password
    }
});

exports.googleApiKey = function () {
    return 'AIzaSyDWopWd36r3M64PhTQnWJY77PtBWkjIINQ';
};


exports.emailAddress = emailAddress;