exports.validate = function (req, res, next) {

    if (req.body.mobile_number) {
        next();
    } else {
        res.status(400).send('Mobile number is required...');
    }
};