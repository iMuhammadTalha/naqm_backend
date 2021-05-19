const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var services = require('../lib/services');

const config = require('../config');
const logger = config.logger.createLogger('lib/passport-jwt');

require('dotenv').config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_TOKEN_SECRET;

module.exports = passport => {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {

        services.deserializeUser(id, function (err, res) {
            done(err, res.rows[0]);
        });
    });

    passport.use(
        'admin-login',
        new JwtStrategy(opts, (jwt_payload, done) => {
            if (jwt_payload.user_type === 'admin') {

                services.isValidAdmin(jwt_payload.email, function (err, res) {
                    if (err) return done(err);
                    if (!res.length) {
                        return done(
                            null,
                            false
                        );
                    }
                });

            }
        })
    );
    passport.use(
        'mobile-login',
        new JwtStrategy(opts, (jwt_payload, done) => {
            if (jwt_payload.user_type === 'driver' || jwt_payload.user_type === 'app_user') {

                services.isValidDriverOrAppUser(jwt_payload.mobile_number, function (err, res) {
                    if (err) return done(err);
                    if (!res.length) {
                        return done(
                            null,
                            false
                        );
                    }
                });

            }
        })
    );
};
