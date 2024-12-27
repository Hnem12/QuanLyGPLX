const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'User', 'Test Admin', 'Verified Admin', 'Director Admin'], default: 'User' },
    SDT: { type: String, required: true },
    Name: { type: String, required: true },
    Address: { type: String, required: true },
    Gender: { type: String, enum: ['Male', 'Female'], required: true },
    email: { type: String, required: true }, // Make sure this is present and required
    status: { type: String, default: 'Inactive' }, // New field for status with default value
    image: { type: String, required: true }, // New field for storing image URL or path
    resetToken: String,
    resetTokenExpiration: Date,
    certificate: { type: String },
    mspId: { type: String },
    type: { type: String },
}, 
{
    collection: 'account' // Specify the collection name here
});

// Create the model
const AccountModel = mongoose.model('Account', AccountSchema);

// Export the model
module.exports = AccountModel;
