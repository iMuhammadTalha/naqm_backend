const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const slugify = require('slugify');

aws.config.update({
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    accessKeyId: process.env.S3_ACCESS_ID,
    region: process.env.S3_REGION
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, JPG, GIF, WEBP and PNG is allowed!'), false);
    }
};

const upload = multer({
    fileFilter,
    storage: multerS3({
        acl: 'public-read',
        s3,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        bucket: process.env.S3_BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, slugify(Date.now().toString() + '-' + file.originalname, '-'));
        }
    })
});

module.exports = upload;