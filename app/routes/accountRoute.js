const path= require('path')
const express = require('express');
var router = express.Router();
const {register,getlogin,postlogin,getAll,getId,addAccount,changePassword,deleteAccount,checklogin,checkadmin,phantrangAccount} = require('../controllers/accountController')
const { check,validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');


router.use(cookieParser())
// Tao tài khoản
router.post('/register',
    [check('username').notEmpty().withMessage('username khong duoc phep de trong'),
    check('password').notEmpty().withMessage('password khong duoc phep de trong')],
    register
);
// đăng nhập
router.get('/login',getlogin)
router.post('/login', postlogin);

router.get('/admin', checklogin, checkadmin,(req, res, next)=>{
    res.json('Xác Thực Thành Công Bạn Đăng nhập đúng tài khoản admin');
})



// phan trang account
router.get('/phantrang', phantrangAccount);
// Lấy dữ liệu từ database
router.get('/', getAll);

// lấy dữ liệu theo id
router.get('/:id', getId);

// Thêm mới dữ liệu vào db
router.post('/', addAccount);

// Cập nhập dữ liệu trong db // doi mat khau
router.put('/:id', changePassword);

// Xóa dữ liệu trong db
router.delete('/:id', deleteAccount);

module.exports = { postlogin };
module.exports= router