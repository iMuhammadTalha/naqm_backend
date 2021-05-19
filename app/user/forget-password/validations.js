
const isValidEmail = function (email) {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};

exports.validateEmail = function(req, res, next){

    if(req.body.email) {
        next();
    } else {
        res.status(400).send('Email is required field...');
    }
};

exports.validatePassword = function(req, res, next){

    if(req.body.password) {
        next();
    } else {
        res.status(400).send('Password is required field...');
    }
};