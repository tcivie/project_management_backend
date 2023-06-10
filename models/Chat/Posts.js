const { Schema, model } = require('mongoose');
const City = require('../City');

const postSchema = new Schema({
    language: {
        type: String,
        required: true,
        immutable: true,
    },
    city: {
        type: Number,
        required: true,
        immutable: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
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
    helpful: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
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
    saves: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    tags: {
        type: [String],
        required: false,
        default: [],
    },
    postImages: {
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
    language, city, userId, title, content, tags, postImages,
}) {
    if (City.getCityByID(city)) {
        const post = new this({
            language,
            city,
            userId,
            title,
            content,
            tags,
            postImages,
        });
        return post.save();
    }
    return null;
};

postSchema.statics.getPostsByLanguage = async function (cityId, language) {
    this.find({ city: cityId, language })
        .then((data) => data)
        .catch((err) => err);
};

module.exports = model('Post', postSchema);
