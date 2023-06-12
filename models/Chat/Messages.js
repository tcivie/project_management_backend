const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        immutable: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true,
    },
    content: {
        type: String,
        required: true,
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: false,
    },
}, { timestamps: true });

messageSchema.index({ postId: 1 }, { unique: false });
messageSchema.index({ userId: 1 }, { unique: false });

// Get all messages for a post
messageSchema.statics.getMessages = async function (postId) {
    this.find({ postId })
        .then((data) => data)
        .catch((err) => err);
};

// get active users
messageSchema.statics.getActiveUsers = async function (postId) {
    this.find({ postId }).distinct('userId')
        .then((data) => data)
        .catch((err) => err);
};

module.exports = mongoose.model('Message', messageSchema);
