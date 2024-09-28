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
router.put('/updatedAccount/',
    [
        check('username').notEmpty().withMessage('username không được phép để trống'),
        check('password').notEmpty().withMessage('password không được phép để trống'),
        check('role').isNumeric().withMessage('Vai trò phải là một số'),
        check('SDT').isNumeric().withMessage('Số điện thoại phải là một số').notEmpty().withMessage('Số điện thoại không được phép để trống'),
        check('Name').notEmpty().withMessage('Tên không được phép để trống'),
        check('Address').notEmpty().withMessage('Địa chỉ không được phép để trống'),
        check('Gender').notEmpty().withMessage('Giới tính không được phép để trống'),
        check('Email').isEmail().withMessage('Email không hợp lệ').notEmpty().withMessage('Email không được phép để trống')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Gọi hàm để xử lý cập nhật tài khoản
        try {
            const { username, password, role, SDT, Name, Address, Gender, Email } = req.body;
            const updatedAccount = await AccountModel.updateOne(
                { username }, // Hoặc tìm kiếm bằng ID nếu cần
                { username, password, role, SDT, Name, Address, Gender, Email }
            );

            if (updatedAccount.nModified > 0) {
                res.json({ success: true, message: 'Tài khoản đã được cập nhật thành công.' });
            } else {
                res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản để cập nhật.' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
        }
    }
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
