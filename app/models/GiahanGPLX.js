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
    CCCD: {  // National ID
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Address: {
        type: String,
        required: true,
        trim: true
    },
    Nationality: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        enum: ['Nam', 'Nữ'], // Có thể mở rộng thêm nếu cần
        required: true
    },
    IssuingPlace: {  // Place of Issue
        type: String,
        required: true,
        trim: true
    },
    LicenseClass: {
        type: String,
        required: true,
        enum: ['B1', 'B2', 'C', 'D', 'E'], // List of available license classes
        trim: true
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
    IssueDate: {
        type: Date,
        required: true
    },
    ExpirationDate: {
        type: Date,
        required: true
    },
    Status: {
        type: String,
        required: true,
        enum: ['Valid', 'Expired'],  // Status: Valid or Expired
        default: 'Valid'  // Default status is Valid
    },
    LicenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    Renewals: [
        {
            renewalDate: {
                type: Date,
                required: true
            },
            newExpirationDate: {
                type: Date,
                required: true
            },
            renewedBy: {
                type: String,
                required: true
            },
            comments: {
                type: String,
                default: 'Renewal successful'
            }
        }
    ]
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
