const mongoose = require('mongoose');
const { Schema } = mongoose;

const CaplaiGPLXSchema = new Schema(
  {
    DateOfRenewal: {
      type: Date,
      required: true, // Date when the license was renewed
    },
    NewExpiryDate: {
      type: Date,
      required: true, // New expiry date for the renewed license
    },
    Lidocaplai: {
      type: String,
      required: true, // Reason for renewal (e.g., 'Bị hỏng')
    },
    chusohuuGPLX_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChusohuuGPLXModel',
      required: true, // This field is required
      index: true, // Indexing for performance
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
    collection: 'caplaiGPLX', // Specify the collection name
  }
);

const CaplaiGPLXModels = mongoose.model('CaplaiGPLX', CaplaiGPLXSchema);
module.exports = CaplaiGPLXModels;
