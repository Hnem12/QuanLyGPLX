const path= require('path')
const express = require('express');
var router = express.Router();
const {register,getlogin,postlogin,getAll,getId,addAccount,changePassword,deleteAccount,checklogin,checkadmin,phantrangAccount, updatedAccount} = require('../controllers/accountController')
const { check,validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const { Xulyanh } = require('../controllers/accountController');
const { imageUpload } = require('../middleware/upload');

// router.post('/Xulyanh', imageUpload.single("image"), Xulyanh);
// router.use("/images", express.static(path.join(__dirname, "uploads")));

router.use(cookieParser());

// Tao tài khoản
router.post('/register', imageUpload.single('image'), register);

router.put('/updateTK/:id',imageUpload.single('image'), updatedAccount);

// đăng nhập
router.post('/login', postlogin);

router.get('/admin', checklogin, checkadmin,(req, res, next)=>{
    res.json('Xác Thực Thành Công Bạn Đăng nhập đúng tài khoản admin');
})

// phan trang account
router.get('/phantrang', phantrangAccount);
// Lấy dữ liệu từ database
router.get('/', getAll);

// lấy dữ liệu theo id
router.get('/getAccount/:id', getId);

// Thêm mới dữ liệu vào db
router.post('/addAccount',imageUpload.single('image'), addAccount);

// Cập nhập dữ liệu trong db // doi mat khau
router.put('/:id', changePassword);

// Xóa dữ liệu trong db
router.delete('/:id', deleteAccount);

module.exports = { postlogin };
module.exports = router