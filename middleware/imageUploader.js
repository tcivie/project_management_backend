const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './uploads/');
    },
    filename(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
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
});

module.exports = upload;
