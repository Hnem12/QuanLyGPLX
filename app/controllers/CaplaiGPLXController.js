const CaplaiGPLXModels = require('../models/CaplaiGPLXModels');
const { check, validationResult } = require('express-validator');

// Hiển thị danh sách cấp GPLX
exports.getAll = (req, res, next) => {
    CaplaiGPLXModels.find({})
        .then(data => {
            res.render('capGplx', { capGplx: data });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Lỗi server khi lấy danh sách cấp GPLX' });
        });
};

// Tìm cấp GPLX theo ID
exports.getId = (req, res, next) => {
    const _id = req.params.id;
    CaplaiGPLXModels.findById(_id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'Cấp GPLX không tồn tại' });
            }
            res.json(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Lỗi server khi tìm cấp GPLX' });
        });
};

// Tạo mới cấp GPLX
exports.taocapGplx = (req, res, next) => {
    res.render('createCapGplx');
};

// Thực hiện tạo cấp GPLX
exports.createCapGplx = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { DateOfRenewal, NewExpiryDate, Lidocaplai, chusohuuGPLX_id } = req.body;

    CaplaiGPLXModels.findOne({ chusohuuGPLX_id })
        .then(data => {
            if (data) {
                return res.json({ message: 'Cấp GPLX này đã tồn tại' });
            } else {
                return CaplaiGPLXModels.create({
                    DateOfRenewal,
                    NewExpiryDate,
                    Lidocaplai,
                    chusohuuGPLX_id,
                });
            }
        })
        .then(data => {
            res.json({ message: 'Tạo cấp GPLX thành công', data });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Tạo cấp GPLX thất bại' });
        });
};

// Sửa thông tin cấp GPLX
exports.updateCapGplx = (req, res, next) => {
    const _id = req.params.id;
    const { NewDateOfRenewal, NewNewExpiryDate, NewLidocaplai } = req.body;

    CaplaiGPLXModels.findByIdAndUpdate(_id, {
        DateOfRenewal: NewDateOfRenewal,
        NewExpiryDate: NewNewExpiryDate,
        Lidocaplai: NewLidocaplai,
    }, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: "Cấp GPLX không tồn tại" });
            }
            res.json({ message: 'Cập nhật cấp GPLX thành công', data });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Lỗi server khi cập nhật cấp GPLX" });
        });
};

// Xóa cấp GPLX
exports.deleteCapGplx = (req, res, next) => {
    const id = req.params.id;
    CaplaiGPLXModels.deleteOne({ _id: id })
        .then(data => {
            if (data.deletedCount > 0) {
                res.json({ message: 'Xóa cấp GPLX thành công' });
            } else {
                res.status(404).json({ message: 'Cấp GPLX không tồn tại' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Lỗi server khi xóa cấp GPLX' });
        });
};
