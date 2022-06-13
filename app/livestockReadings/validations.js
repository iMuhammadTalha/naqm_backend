exports.validateField = function (req, res, next) {

    if (req.body.body_temperature && req.body.atmospheric_temperature && req.body.atmospheric_humidity && req.body.beat_per_min && req.body.Ax && req.body.Ay && req.body.Az && req.body.Gx && req.body.Gy && req.body.Gz && req.body.animal_id) {
        next();
    } else {
        next();
        // res.status(400).send('Required fields missed...');
    }

};