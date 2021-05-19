/** @format */

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var pool = require("./db/db");

require("dotenv").config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_TOKEN_SECRET;

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  // passport.deserializeUser(function(user, done) {
  // 	done(null, user);
  // });

  passport.deserializeUser(function (id, done) {
    // console.log("id :", id);
    try {
      pool.query("SELECT * FROM users WHERE id = ? ", [id], function (
        err,
        rows
      ) {
        done(err, rows[0]);
      });
    } catch (error) {
      logger.error(error);
    }
  });

  passport.use(
    "web-login",
    new JwtStrategy(opts, (jwt_payload, done) => {
      if (jwt_payload.user_type == "admin") {
        try {
          pool.query(
            `SELECT * FROM users WHERE user_type='admin' AND id = '${jwt_payload.id}' `,
            [],
            (err, res) => {
              if (err) {
                return done(err);
              } else {
                console.log(res.rows);

                if (res.rowCount === 0) {
                  return done(
                    null,
                    false
                    // req.flash("loginMessage", "No User Found")
                  );
                } else {
                  return done(null, res.rows[0]);
                }
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      } else if (jwt_payload.user_type == "fleet") {
        try {
          pool.query(
            `SELECT * FROM users WHERE user_type='fleet' AND id = '${jwt_payload.id}' `,
            [],
            (err, res) => {
              if (err) {
                return done(err);
              } else {
                console.log(res.rows);

                if (res.rowCount === 0) {
                  return done(
                    null,
                    false
                    // req.flash("loginMessage", "No User Found")
                  );
                } else {
                  return done(null, res.rows[0]);
                }
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        return done();
      }
    })
  );
  passport.use(
    "mobile-login",
    new JwtStrategy(opts, (jwt_payload, done) => {
      if (jwt_payload.user_type == "driver") {
        try {
          pool.query(
            `SELECT * FROM users WHERE user_type='driver' AND id = '${jwt_payload.id}' `,
            [],
            function (err, rows) {
              // console.log('rows', rows);
              if (err) return done(err);
              if (!rows.length) {
                return done(
                  null,
                  false
                  // req.flash("loginMessage", "No User Found")
                );
              }
              return done(null, rows[0]);
            }
          );
        } catch (error) {
          logger.error(error);
        }
      } else if (jwt_payload.user_type == "app_user") {
        try {
          pool.query(
            `SELECT * FROM users WHERE user_type='app_user' AND id = '${jwt_payload.id}' `,
            [],
            function (err, rows) {
              // console.log('rows', rows);
              if (err) return done(err);
              if (!rows.length) {
                return done(
                  null,
                  false
                  // req.flash("loginMessage", "No User Found")
                );
              }
              return done(null, rows[0]);
            }
          );
        } catch (error) {
          logger.error(error);
        }
      } else {
        return done();
      }
    })
  );
  passport.use(
    "fleet-login",
    new JwtStrategy(opts, (jwt_payload, done) => {
      if (jwt_payload.user_type == "fleet") {
        try {
          pool.query(
            `SELECT * FROM users WHERE user_type='fleet' AND id = '${jwt_payload.id}' `,
            [],
            (err, res) => {
              if (err) {
                return done(err);
              } else {
                console.log(res.rows);

                if (res.rowCount === 0) {
                  return done(
                    null,
                    false
                    // req.flash("loginMessage", "No User Found")
                  );
                } else {
                  return done(null, res.rows[0]);
                }
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        return done();
      }
    })
  );
};
