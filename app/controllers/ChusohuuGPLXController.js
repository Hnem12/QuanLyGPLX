const { name } = require('ejs');
const ChusohuuGPLXModel = require('../models/ChusohuuGPLXModel');
const { check, validationResult } = require('express-validator');

// hiển thị danh mục 
exports.getAll =  (req, res, next) => {
    ChusohuuGPLXModel.find({})
        .then(data => {
            //  res.json(data)
            res.render('danhmuc',{ danhmucs :data})
        })
        .catch(err => {
        res.status(500).json('Loi server 1')
    })
}
// tìm danh mục theo id
exports.getId =  (req, res, next) => {
    var _id = req.params.id
    ChusohuuGPLXModel.findById({ _id })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
        res.status(500).json('Loi server 2')
    })
}

exports.taodanhmuc= (req, res, next) => {
    res.render('addLicenseHolder')
}


exports.addLicenseHolder = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }

    // Extract fields from the request body
    const {
        name, maGPLX, DateOfBirth, CCCD, Address, PhoneNumber,
        Email, Ngaycap, Ngayhethan, Status, Giamdoc, Loivipham
    } = req.body;

    // Check if the license holder already exists
    ChusohuuGPLXModel.findOne({
        Name: name,
        DateOfBirth,
        CCCD,
        Address,
        PhoneNumber,
        Email,
        Ngaycap,
        Ngayhethan,
        Status,
        MaGPLX: maGPLX
    })
    .then(data => {
        if (data) {
            return res.json('Người dùng này đã tồn tại');
        } else {
            // Create a new license holder, MongoDB will automatically generate _id
            return ChusohuuGPLXModel.create({
                Name: name,
                DateOfBirth,
                CCCD,
                Address,
                PhoneNumber,
                Email,
                Ngaycap,
                Ngayhethan,
                Status,
                MaGPLX: maGPLX
            });
        }
    })
    .then(data => {
        if (data) {
            res.json('Tạo danh mục thành công');
        }
    })
    .catch(err => {
        res.status(500).json('Tạo danh mục thất bại');
    });
};


// sửa danh mục 
exports.updateLicenseHolder = async (req, res) => {
    try {
        const _id = req.params.id; // Lấy ID từ URL
        const updateData = {
            MaGPLX: req.body.maGPLX,
            Name: req.body.newname,
            DateOfBirth: req.body.newDateOfBirth,
            CCCD: req.body.newcCCD,
            Address: req.body.newaddress,
            HangGPLX: req.body.newHangGPLX,
            PhoneNumber: req.body.newphoneNumber,
            Email: req.body.newemail,
            Ngaycap: req.body.newngaycap,
            Ngayhethan: req.body.newngayhethan,
            Ngaytrungtuyen: req.body.newngaytrungtuyen,
            Status: req.body.newstatus,
            Giamdoc: req.body.giamdoc,
            Loivipham: req.body.loivipham
        };

        // Tìm đối tượng GPLX bằng ID và cập nhật thông tin
        const licenseHolder = await LicenseHolder.findById(_id);

        if (!licenseHolder) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng với ID này.' });
        }

        // Sử dụng method `updateInfo` đã được định nghĩa trong schema
        await licenseHolder.updateInfo(updateData);

        res.json({ message: 'Cập nhật thành công!' });
    } catch (error) {
        console.error('Lỗi khi cập nhật GPLX:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
    }
};

// xóa danh mục 
exports.deleteCategory = (req, res, next) => {
    var id = req.params.id;
    ChusohuuGPLXModel.deleteOne({
        _id: id
    })
        .then(data => {
            if (data) {
                res.json('Xoa thanh cong');
            }
            else {
                res.json('Xoa that bai')
            }
        })
        .catch(err => {
        res.status(500).json('loi server 4')
    })
}


