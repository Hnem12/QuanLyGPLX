// models/Image.js
const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
}, {
    collection: 'account' // tên collection trong MongoDB
});

const Image = mongoose.model('Image', ImageSchema);
module.exports = Image;
