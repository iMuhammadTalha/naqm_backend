exports.validateField = function (req, res, next) {

    if (req.body.ch4 && req.body.co && req.body.dust && req.body.humidity && req.body.latitude && req.body.longitude && req.body.nh3 && req.body.no2 && req.body.node_id && req.body.co2 && req.body.temperature) {
        next();
    } else {
        next();
        // res.status(400).send('Required fields missed...');
    }

};