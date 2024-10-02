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
    Status: {
        type: String,
        required: true,
        enum: ['Đã kích hoạt', 'Chưa kích hoạt'],
        default: 'Đã kích hoạt'
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
    }
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