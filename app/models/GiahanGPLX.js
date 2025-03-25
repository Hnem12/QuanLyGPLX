const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define schema for GPLX renewal
const LicenseRenewalSchema = new Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    DateOfBirth: {
        type: Date,
        required: true
    },
    CCCD: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Gender: { type: String,
        enum: ['Male', 'Female'], 
        required: true },
    Address: {
        type: String,
        required: true,
        trim: true
    },
    HangGPLX: {
        type: String,
        required: true,
        enum: ['B1', 'B2', 'C', 'D', 'E', 'A', 'A1', 'A2'], // Danh sách các hạng GPLX có sẵn
        trim: true
    },
       Country: {
        type: String,
        required: true,
        enum: ['Vietnam', 'USA', 'UK', 'France', 'Germany', 'Other'], // Danh sách các quốc gia
        default: 'Vietnam'
    },
    PhoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        match: /.+\@.+\..+/
    },
    Ngaycap: {
        type: Date,
        required: true
    },
    Ngayhethan: {
        type: Date,
        required: true
    },
    Ngaytrungtuyen: {
        type: Date,
        required: true
    },
    Status: {
        type: String,
        enum: ['Đã hết hạn', 'Chờ kiểm định', "Đã kích hoạt"],
        default: 'Chờ kiểm định'
    },
    Giamdoc: {
        type: String,
        required: true
    },
    Loivipham: {
        type: String,
        default: 'Không có'
    },
    MaGPLX: {
        type: String,
        required: true,
        unique: true
    },
    image: { type: String, required: true }  
}, {
    collection: 'licenseRenewals',
    timestamps: true  // Automatically create createdAt and updatedAt fields
});

// Method to update license info
LicenseRenewalSchema.methods.updateInfo = async function(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid update data');  // Validate input data
    }
    
    // Update fields in the current object
    Object.assign(this, data);
    return await this.save();  // Save updated object
};

// Method to add a new renewal
LicenseRenewalSchema.methods.addRenewal = async function(renewalData) {
    if (!renewalData || typeof renewalData !== 'object') {
        throw new Error('Invalid renewal data');
    }

    this.Renewals.push(renewalData);  // Add renewal info to the Renewals array
    return await this.save();  // Save the updated object
};

// Create model from schema
const LicenseRenewal = mongoose.model('LicenseRenewal', LicenseRenewalSchema);

module.exports = LicenseRenewal;
