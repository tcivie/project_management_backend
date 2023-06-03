const mongoose = require('mongoose');
const { Mongoose } = require('mongoose');

const postSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true,
        immutable: true,
    },
    city: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true,
        immutable: true,
    },
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    views: {
        type: Number,
        required: false,
        default: 0,
    },
    helpful: {
        type: Number,
        required: false,
        default: 0,
    },
    comments: {
        type: Number,
        required: false,
        default: 0,
    },
    liveUsers: {
        type: Number,
        required: false,
        default: 0,
    },
    tags: {
        type: [String],
        required: false,
        default: [],
    },
}, { timestamps: true });

postSchema.index({ city: 1 }, { unique: false });
postSchema.index({ language: 1 }, { unique: false });

postSchema.statics.getPosts = async function (cityId) {
    this.find({ city: cityId })
        .then((data) => data)
        .catch((err) => err);
};

postSchema.statics.create = async function ({
    language, city, userId, title, content, tags,
}) {
    const post = new this({
        language,
        city,
        userId,
        title,
        content,
        tags,
    });
    return post.save();
};

postSchema.statics.getPostsByLanguage = async function (cityId, language) {
    this.find({ city: cityId, language })
        .then((data) => data)
        .catch((err) => err);
};

module.exports = mongoose.model('Post', postSchema);
