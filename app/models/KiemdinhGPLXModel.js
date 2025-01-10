const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho kiểm định GPLX
const KiemdinhGPLXSchema = new Schema({
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
        enum: ['B1', 'B2', 'C', 'D', 'E'], // Hạng GPLX
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
        match: /.+\@.+\..+/,
        trim: true
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
        enum: ['Đã kích hoạt', 'Chưa kiểm định', 'Đang kiểm định', 'Hoàn thành kiểm định'],
        default: 'Chưa kiểm định'
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
    image: { 
        type: String, 
        required: true 
    },
    NgayKiemDinh: {
        type: Date,
        required: true
    },
    NguoiKiemDinh: {
        type: String,
        required: true
    },
    BuocKiemDinh: {
        type: String,
        enum: ['Bước 1', 'Bước 2','Kiểm định cuối cùng'],
        required: true
    }
}, {
    collection: 'kiemdinhGPLX',
    timestamps: true // Tạo tự động trường createdAt và updatedAt
});

const KiemdinhGPLX = mongoose.model('kiemdinhGPLX', KiemdinhGPLXSchema);

module.exports = KiemdinhGPLX;
