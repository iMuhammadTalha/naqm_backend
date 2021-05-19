const moment = require('moment');
const services = require('./services');
const config = require('../../../config');
const logger = config.logger.createLogger('user/admin/controller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = process.env.JWT_TOKEN_SECRET;

exports.getAllAdmins = function (req, res, next) {
    services.getAllAdminsProfile(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all admins'});
        }

        res.locals.allAdminUsers = rows;
        next();
    });
};

exports.getAAdmin = function (req, res, next) {
    services.getAAdminProfile(req.params.id, function (err, adminRow) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get a admin'});
        }
        res.locals.aAdminUser = adminRow[0];
        if(adminRow[0]){
            services.getAAdminCities(adminRow[0].admin_id, function (err, citiesRow) {
                if (err) {
                    logger.error(err);
                    return res.status(400).send({msg: 'Error in get a admin cities'});
                }
                res.locals.aAdminUser.cities = [...citiesRow];
                next();
            });
        } else {
            res.locals.aAdminUser.cities = [];
            next();
        }
    });
};

exports.createAdmin = function (req, res, next) {
    let dbImageName = req.file ? req.file.location : '';

    let password = req.body.password;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            const adminProfile = {
                mobile_number: req.body.mobile_number,
                email: req.body.email,
                profile_pic: dbImageName,
                created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                user_type: 'admin',
                updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                role: req.body.role,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                adminCity:req.body.cities,
                password: password
            };
            // To handle insertion error due to ' in query
            adminProfile.email = adminProfile.email.replace(/'/g, '');
            adminProfile.first_name = adminProfile.first_name.replace(/'/g, '');
            adminProfile.last_name = adminProfile.last_name.replace(/'/g, '');
            adminProfile.role = adminProfile.role.replace(/'/g, '');
            services.createAdminProfile(adminProfile, function (err, user) {
                if (err) {
                    logger.error(err);
                    res.status(400).json({msg: 'Error'});
                }
                if (user === 1) {
                    res.status(200).json({msg: 'Admin Created'});
                } else {
                    res.status(200).json({msg: 'Admin not Created'});
                }
                next();
            });
        });
    });

};

exports.loginAdmin = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    services.findAdminByEmail(email, function (err, user) {
        if (err) {
            logger.error('Error:', err);
            return res.status(400).send({msg: 'Error in login admin'});

        }
        if (user.rowCount === 0) {
            return res.status(400).json({
                msg: 'Admin not found. Please Register'
            });
        }
        // Check Password
        bcrypt.compare(password, user.rows[0].password).then(isMatch => {
            if (isMatch) {
                // User Matched
                const payload = {
                    id: user.rows[0].id,
                    email: user.rows[0].email,
                    user_type: user.rows[0].user_type,
                    role: user.rows[0].role
                }; // Create JWT Payload
                const token = jwt.sign(payload, keys, {expiresIn: 3600000000000});
                var updateAdminUserJWTToken = {
                    jwt: token,
                    user_id: user.rows[0].id
                };

                services.updateAdminJWTToken(updateAdminUserJWTToken, function (err, updatedUserJwtToken) {
                    if (err) res.status(400).json({msg: err});
                });
                res.status(200).json({
                    token: 'Bearer ' + token
                });
            } else {
                return res.status(400).json({
                    msg: 'Password incorrect.'
                });
            }
        });
    });
};
exports.deleteAdmin = function (req, res, next) {
    services.deleteAdminProfile(req.params.id, function (err, affectedRows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in delete admin'});
        }
        if (affectedRows === 0) {
            res.locals.Msg = 'No admin profile Found with the given id';
        } else {
            res.status(200).json({msg: 'Admin Deleted'});
        }
        next();
    });
};

exports.updateAdmin = function (req, res, next) {
    let dbImageName = req.file ? req.file.location : req.body.profile_pic;
    const admin = {
        email: req.body.email,
        profile_pic: dbImageName,
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        adminCity:req.body.cities,
        role: req.body.role
    };
    if (req.body.password) {
        admin.password = req.body.password;
    }
    // To handle insertion error due to ' in query
    admin.email = admin.email.replace(/'/g, '');
    admin.first_name = admin.first_name.replace(/'/g, '');
    admin.last_name = admin.last_name.replace(/'/g, '');
    admin.role = admin.role.replace(/'/g, '');
    services.getAAdminProfile(req.params.id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get a admin'});
        }
        if(rows[0].admin_id){
            services.deleteAAdminCities(rows[0].admin_id, function (err, affectedRows) {
                for(let i=0; i<req.body.cities.length; i++){
                    services.addAdminCity(rows[0].admin_id, req.body.cities[i].id, function (err, adminCity){
                        if(err){
                            logger.error(err);
                            return res.status(400).send({msg: 'Error in adding admin cities'});
                        }
                    });
                }
                services.updateAdminProfile(req.params.id, admin, function (err, affectedRows) {
                    if (err) {
                        logger.error(err);
                        return res.status(400).send({msg: 'Error in update admin'});
                    } else {
                        res.status(200).json({msg: 'Admin Updated'});
                    }
                    next();
                });
            });
        } else {
            res.locals.Msg = 'No admin Found with the given id';
        }
    });
};

exports.getTotalRides = function (req, res, next) {
    res.locals.totalRides = {totalRides: 0};
    services.getTotalRides(req.params.time, req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get total rides'});
        }
        if (rows[0]) {
            res.locals.totalRides.totalRides = rows[0].count;
        }
        next();
    });
};

exports.getTotalCompletedRides = function (req, res, next) {
    res.locals.totalCompletedRides = {totalCompletedRides: 0};
    services.getTotalCompletedRides(req.params.time, req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get total completed rides'});
        }
        if (rows[0]) {
            res.locals.totalCompletedRides.totalCompletedRides = rows[0].count;
        }
        next();
    });
};

exports.getRevenue = function (req, res, next) {
    res.locals.totalRevenue = {totalRevenue: 0};
    services.getTotalRevenue(req.params.time, req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get total ride revenue'});
        }
        if (rows[0]) {
            res.locals.totalRevenue.totalRevenue = rows[0].total_fare;
        }
        next();
    });
};

exports.getTotalEarning = function (req, res, next) {
    res.locals.totalEarning = {totalEarning: 0};
    services.getTotalEarning(req.params.time, req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get total ride revenue'});
        }
        if (rows[0]) {
            res.locals.totalEarning.totalEarning = rows[0].total_fare;
        }
        next();
    });
};

exports.getTotalServices = function (req, res, next) {
    res.locals.totalServices = {totalServices: 0};
    services.getTotalServices(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get total service'});
        }
        if (rows[0]) {
            res.locals.totalServices.totalServices = rows[0].count;
        }
        next();
    });
};

exports.getTotalCancelledRides = function (req, res, next) {
    res.locals.totalCancelledRides = {totalCancelledRides: 0};
    services.getTotalCancelledRides(req.params.time, req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get total cancelled rides'});
        }
        if (rows[0]) {
            res.locals.totalCancelledRides.totalCancelledRides = rows[0].count;
        }
        next();
    });
};

exports.getTotalUserCancelledRides = function (req, res, next) {
    res.locals.totalUserCancelledRides = {totalUserCancelledRides: 0};
    services.getTotalUserCancelledRides(req.params.time, req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get total user cancelled rides'});
        }
        if (rows[0]) {
            res.locals.totalUserCancelledRides.totalUserCancelledRides = rows[0].count;
        }
        next();
    });
};

exports.getTotalDriverCancelledRides = function (req, res, next) {
    res.locals.totalDriverCancelledRides = {totalDriverCancelledRides: 0};
    services.getTotalDriverCancelledRides(req.params.time, req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get total driver cancelled rides'});
        }
        if (rows[0]) {
            res.locals.totalDriverCancelledRides.totalDriverCancelledRides = rows[0].count;
        }
        next();
    });
};

exports.getTotalDrivers = function (req, res, next) {
    res.locals.totalDrivers = {totalDrivers: 0};
    services.getTotalDrivers(req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get total drivers'});
        }
        if (rows[0]) {
            res.locals.totalDrivers.totalDrivers = rows[0].count;
        }
        next();
    });
};

exports.getRecentCompletedRides = function (req, res, next) {
    services.getRecentCompletedRides(req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get recent completed rides'});
        }

        res.locals.recentCompletedRides = rows;
        next();
    });
};

exports.getRecentCancelledRides = function (req, res, next) {
    services.getRecentCancelledRides(req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get recent cancelled rides'});
        }

        res.locals.recentCancelledRides = rows;
        next();
    });
};

exports.getOnboardingDrivers = function (req, res, next) {
    services.getOnboardingDrivers(req.user.adminCities, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get on boarding driver'});
        }

        res.locals.onboardingDrivers = rows;
        next();
    });
};

exports.getTopDrivers = function (req, res, next) {
    services.getTopDrivers(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get total drivers'});
        }

        res.locals.topDrivers = rows;
        next();
    });
};

exports.getUsersOTPbyPhoneNumber = function (req, res, next) {
    services.getUsersOTPbyPhoneNumber(req.params.phone_number, req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get user otp by phone number.'});
        }
        res.locals.users = rows;
        next();
    });
};
