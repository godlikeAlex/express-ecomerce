const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 32,
        required: true
    }
});

module.exports = mongoose.model('Category', CategorySchema);