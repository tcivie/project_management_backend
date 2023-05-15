const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
        },
        roles: {
            type : Number,
            required: false,
            default: 0,
        },
        nickname: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            required: false,
            default: true,
        }
    },
    { timestamps: true },
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

// Hashes the password using bcrypt and sets the hashed password as the password field
userSchema.methods.hashPassword = async function () {
    const saltRounds = 10;
    this.hashedPassword = await bcrypt.hash(this.hashedPassword, saltRounds);
};

// Validates the password using bcrypt
userSchema.methods.validPassword = async function (password) {
    return bcrypt.compare(password, this.hashedPassword);
};

module.exports = mongoose.model('User', userSchema);
