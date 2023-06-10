const multer = require('multer');
const { extname } = require('path');
const fs = require('fs');
const posts = require('../models/Chat/Posts');
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

const deleteExistingImages = async (req, res, next) => {
    console.log('delete existing images');
    const post = await posts.findById(req.params.postId).exec();
    if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    const currentImages = post.postImages;
    console.log('currentImages', currentImages);
    const existingImages = JSON.parse(req.body.existingImages || '[]');
    console.log('existingImages', existingImages);
    currentImages.forEach((path) => {
        if (!existingImages.includes(path)) {
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'An error occurred while deleting images.' });
                }
            });
        }
    });

    next();
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

module.exports = { upload, uploadMultiple, deleteExistingImages };
