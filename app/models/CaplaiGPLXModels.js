const mongoose = require('mongoose');
const { Schema } = mongoose;

const CaplaiGPLXSchema = new Schema({
    DateOfRenewal: Date,
    NewExpiryDate: Date,
    LicenseType: String,
    RenewalLocation: String,
    Don: String,
    Status: String,
    Loivipham: String,
    Giamdoc: String,
    chusohuuGPLX_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chusohuuGPLX' // Liên kết tới model chủ sở hữu GPLX
    }
}, { collection: 'caplaiGPLX' });

const CaplaiGPLXModels = mongoose.model('caplaiGPLX', CaplaiGPLXSchema);
module.exports = CaplaiGPLXModels;
