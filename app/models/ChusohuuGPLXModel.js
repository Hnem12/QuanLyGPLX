const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Định nghĩa schema cho chủ sở hữu GPLX
const ChusohuuGPLXSchema = new Schema({
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
    Gender: { type: String,
        enum: ['Male', 'Female'], 
        required: true },
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
}, {
    collection: 'chusohuuGPLX',
    timestamps: true // Tự động tạo trường createdAt và updatedAt
});

// Cập nhật thông tin chủ sở hữu GPLX
ChusohuuGPLXSchema.methods.updateInfo = async function(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Dữ liệu cập nhật không hợp lệ'); // Kiểm tra dữ liệu đầu vào
    }
    
    // Cập nhật các trường trong đối tượng hiện tại
    Object.assign(this, data);
    return await this.save(); // Lưu đối tượng đã cập nhật
};

// Tạo model từ schema
const LicenseHolder = mongoose.model('LicenseHolder', ChusohuuGPLXSchema);

module.exports = LicenseHolder;