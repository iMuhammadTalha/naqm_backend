const {getAllUsers, createUser, deleteUser, updateUser} = require('./controller');
const validation = require('../user/validations');
const router = require('express').Router();
const path = require('path');
// const {isTokenExpired} = require('../../lib/validation');
// const upload = require('../../lib/imageUpload');

// router.get('/get-all-users', isTokenExpired, getAllUsers, function (req, res) {
    // res.send(res.locals.allUsers);
// });

// router.post('/create-user', upload.fields([{name: 'image'}, {name: 'cnic_front'}]), validation.validate, createUser);

// router.put('/update-user/:id', upload.single('image'), validation.validate, updateUser);

// router.delete('/delete-user/:id', deleteUser);

// router.use('/device-info', require(path.join(__dirname, '/device-info/routes.js')));
router.use('/auth', require(path.join(__dirname, '/auth/routes.js')));
// router.use('/admin', require(path.join(__dirname, '/admin/routes.js')));
// router.use('/app-user', require(path.join(__dirname, '/app-user/routes.js')));
// router.use('/fleet', require(path.join(__dirname, '/fleet/routes.js')));
// router.use('/driver', require(path.join(__dirname, '/driver/routes.js')));

module.exports = router;