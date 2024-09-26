const CaplaiGPLXModels = require('../models/CaplaiGPLXModels');
const { check, validationResult } = require('express-validator');

// hiển thị danh mục 
exports.getAll =  (req, res, next) => {
    CaplaiGPLXModels.find({})
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
    CaplaiGPLXModels.findById({ _id })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
        res.status(500).json('Loi server 2')
    })
}

exports.taodanhmuc= (req, res, next) => {
    res.render('createDanhMuc')
}


exports.createCategory = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }
    var Tendanhmuc = req.body.tendanhmuc
    var Mota = req.body.mota
    DanhmucModel.findOne({
        tendanhmuc: Tendanhmuc,
    })
    .then(data => {
        if (data) {
        res.json('Danh mục này đã tồn tại')
        }
        else {
            return CaplaiGPLXModels.create({
                tendanhmuc: Tendanhmuc,
                mota: Mota,
            })
        }
    })
        .then(data => {
            if(data){
                res.json('Tao danh muc thanh cong')
                }
        })
        .catch(err => {
        res.status(500).json('Tao danh muc that bai')
    })
}

// sửa danh mục 
exports.updateCategory = (req, res, next) => {
    var _id = req.params.id
    var Newtendanhmuc = req.body.newtendanhmuc
    var NewmoTa=req.body.newmota
    DanhmucModel.findByIdAndUpdate(_id, {
        tendanhmuc: Newtendanhmuc,
        mota: NewmoTa,
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
    DanhmucModel.deleteOne({
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
        res.status(500).json('loiserver 4')
    })
}

