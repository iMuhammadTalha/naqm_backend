exports.validateField = function (req, res, next) {
    if (req.body.nitrogen && req.body.phosphorus && req.body.potassium && req.body.soil_moisture && req.body.node_id) {
        next();
    } else {
        next();
        // res.status(400).send('Required fields missed...');
    }

};