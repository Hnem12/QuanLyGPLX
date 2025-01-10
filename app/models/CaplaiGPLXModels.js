const mongoose = require('mongoose');
const { Schema } = mongoose;

const CaplaiGPLXSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true
  },
  Lidocaplai: {
    type: String,
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
      enum: ['B1', 'B2', 'C', 'D', 'E'], // Danh sách các hạng GPLX có sẵn
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
      enum: ['Đã kích hoạt', 'Chờ kiểm định'],
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
  },
  {
    timestamps: true,
    collection: 'caplaiGPLX',
  }
);

const CaplaiGPLXModels = mongoose.model('caplaiGPLX', CaplaiGPLXSchema);
module.exports = CaplaiGPLXModels;
