const multer = require('multer');
const { extname } = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        // check if image is avatar or post image
        if (req.baseUrl === '/api/v1/images/userAvatar') {
            cb(null, './uploads/users/');
        } else {
            cb(null, './uploads/posts/');
        }
    },
    filename(req, file, cb) {
        cb(null, Date.now() + extname(file.originalname)); // Rename file
    },
});

// Filter out file types you don't want (optional)
const fileFilter = (req, file, cb) => {
    // Reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Initialize multer upload
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter,
}).single('image');

const uploadMultiple = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter,
}).array('images', 5);

module.exports = { upload, uploadMultiple };
