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
exports.updateCategory = (req, res, next) => {
    var _id = req.params.id
    var NewmaGPLX = req.body.maGPLX
    var Newname = req.body.newname
    var NewDateOfBirth =req.body.newDateOfBirth
    var NewAddress =req.body.newaddress
    var NewCCCD =req.body.newcCCD
    var NewPhoneNumber =req.body.newphoneNumber
    var NewEmail =req.body.newemail
    var NewNgaycap =req.body.newngaycap
    var NewNgayhethan =req.body.newngayhethan
    var NewStatus =req.body.newstatus
    var Newgiamdoc = req.body.giamdoc
    var Newloivipham = req.body.loivipham
    ChusohuuGPLXModel.findByIdAndUpdate(_id, {
        Name: Newname,
        DateOfBirth: NewDateOfBirth,
        CCCD: NewCCCD, Address: NewAddress,
        PhoneNumber:  NewPhoneNumber, Email: NewEmail, Ngaycap: NewNgaycap,
         Ngayhethan: NewNgayhethan, Status: NewStatus,
         Giamdoc: Newgiamdoc, Loivipham: Newloivipham, NewmaGPLX: NewmaGPLX
    })
        .then(data => {
            if (data) {
            res.json('Update thanh cong nhe')
            }
            else {
                res.json("Update that bai")
            }
        })
        .catch(err => {
            res.status(500).json("Loi server 3")
    })
}

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


