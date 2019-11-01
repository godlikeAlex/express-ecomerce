const mongoose  = require('mongoose');
const crypto    = require('crypto');
const uuid      = require('uuid/v1');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0,
    },
    history: {
        type: Array,
        default: []
    }
}, {timestamps: true});

userSchema.virtual('password')
.set(password => {
    this._password = password;
    this.salt = uuid();
    this.hashed_password = this.encryptPassword(password)
}).get(() => {
    return this._password;
});

userSchema.methods = {
    encryptPassword: password => {
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest("hex");
        } catch (e) {
            return '';
        }
    }
};

module.exports = mongoose.model('User', userSchema );