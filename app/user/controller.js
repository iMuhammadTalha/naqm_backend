const moment = require('moment');
const services = require('../user/services');
const config = require('../../config/index.js');
const logger = config.logger.createLogger('user/controller');

exports.getAllUsers = function (req, res, next) {
    services.getAllUsers(function (err, rows) {
        if (err) {
            logger.error('err :', err);
            return res.status(400).send({msg: 'Error in get all users'});
        }

        res.status(200).send(rows);
    });
};

exports.createUser = function (req, res) {
    let profile_pic = req.file ? req.file.location : '';

    const user = {
        mobile_number: req.body.mobile_number,
        email: req.body.email,
        profile_pic: profile_pic,
        created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        user_type: req.body.user_type,
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    };
    services.createUser(user, function (err, user) {
        if (err) {
            return res.status(400).send('Error');
        }
        if (user === 1) {
            return res.status(200).send('User Created');
        } else {
            return res.status(200).send('User not Created');
        }
    });

};

exports.deleteUser = function (req, res) {
    services.deleteUser(req.params.id, function (err, affectedRows) {
        if (err) {
            return res.status(400).send(err);
        }
        if (affectedRows === 0) {
            return res.status(200).send('No user Found with the given id');
        } else {
            return res.status(200).send('User Deleted');
        }
    });
};

exports.updateUser = function (req, res, next) {
    let dbImageName = ' ';
    if (req.file) {
        dbImageName = req.file.location;
    } else {
        dbImageName = req.body.profile_pic;
    }
    const user = {
        mobile_number: req.body.mobile_number,
        email: req.body.email,
        profile_pic: dbImageName,
        user_type: req.body.user_type,
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    };
    services.updateUser(req.params.id, user, function (err, affectedRows) {
        if (err) {
            return res.status(400).send(err);
        }
        if (affectedRows === 0) {
            res.status(200).send('No user Found with the given id');
        } else {
            res.status(200).send('User Updated');
        }
        next();
    });
};