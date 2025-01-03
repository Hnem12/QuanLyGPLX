const path= require('path')
const express = require('express');
var router = express.Router();
const {register,getlogin,createKeyForUser,getPublicKeyForUser,postlogin,getAll,getId,addAccount,changePassword,deleteAccount,checklogin,checkadmin,phantrangAccount, updatedAccount, updatedthongtin,forgotPassword, resetPassword} = require('../controllers/accountController')
const { check,validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const { Xulyanh } = require('../controllers/accountController');
const { imageUpload } = require('../middleware/upload');
const { revokeKeyController } = require('../controllers/accountController');

router.use(cookieParser());
router.post('/forgot-password', forgotPassword);

// Route for resetting the password
router.post('/reset-password/:token', resetPassword); // Ensure you handle the token in the request
// Tao tài khoản
router.post('/register', imageUpload.single('image'), register);
router.post('/Taokhoanguoidung/:accountId', createKeyForUser);
router.get('/LayCA/:accountId', getPublicKeyForUser);

router.put('/updateTK/:id',imageUpload.single('image'), updatedAccount);
router.put('/updatethongtin/:id',imageUpload.single('image'), updatedthongtin);

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
router.get('/account/:_id', getId);

// Thêm mới dữ liệu vào db
router.post('/addAccount',imageUpload.single('image'), addAccount);

// Cập nhập dữ liệu trong db // doi mat khau
router.put('/change-password/:id', changePassword);

// Xóa dữ liệu trong db
router.delete('/:id', deleteAccount);
router.post('/revokekey', revokeKeyController);


module.exports = { postlogin };
module.exports = router