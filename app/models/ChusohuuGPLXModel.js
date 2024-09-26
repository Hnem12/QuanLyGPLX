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
        enum: ['Đã kích hoạt', 'Chưa kích hoạt', 'Tạm dừng'],
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

// Tìm kiếm chủ sở hữu GPLX theo Mã GPLX
ChusohuuGPLXSchema.statics.findByMaGPLX = async function(MaGPLX) {
    return await this.findOne({ MaGPLX });
};

// Cập nhật thông tin chủ sở hữu GPLX
ChusohuuGPLXSchema.methods.updateInfo = async function(data) {
    Object.assign(this, data);
    return await this.save();
};

const ChusohuuGPLXModel = mongoose.model('ChusohuuGPLX', ChusohuuGPLXSchema);
module.exports = ChusohuuGPLXModel;
