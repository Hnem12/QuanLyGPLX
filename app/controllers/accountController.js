const AccountModel = require('../models/accountModel');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, password, role, SDT, Name, Address, Gender, email, status } = req.body;

        // Log the incoming request body
        console.log('Incoming registration data:', req.body);

        // Validate inputs
        if (!username || !password || !SDT || !Name || !Address || !Gender || !email) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email format regex
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email không hợp lệ' });
        }

        // Check if the email already exists
        const existingEmailUser = await AccountModel.findOne({ email });
        if (existingEmailUser) {
            return res.status(400).json({ message: 'Email này đã tồn tại' });
        }

        const existingUser = await AccountModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User này đã tồn tại' });
        }

        // Validate role
        const allowedRoles = ['User']; // Allow only 'user'
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ' });
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await AccountModel.create({
            username,
            password: encryptedPassword,
            role,
            SDT,
            Name,
            Address,
            Gender,
            Image,
            email, // Ensure email is included here
            status // Default status
        });

        return res.status(201).json({ message: 'Tạo tài khoản thành công', user: newUser });
    } catch (error) {
        console.error('Lỗi khi tạo tài khoản:', error);
        return res.status(500).json({ message: 'Tạo tài khoản thất bại', error: error.message });
    }
};



// Đăng nhập
const postlogin = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const account = await AccountModel.findOne({ username });
        if (!account) {
            return res.status(401).json('Tài khoản không chính xác');
        }

        const checkPassword = bcrypt.compareSync(password, account.password);
        if (!checkPassword) {
            return res.status(401).json('Mật khẩu không chính xác');
        } else {
            const token = jwt.sign({ _id: account._id }, 'Hnem');
            res.cookie('token', token, { httpOnly: true });
            return res.json({
                message: 'Đăng nhập thành công',
                userData: {
                    username: account.username,
                    role: account.role,
                    SDT: account.SDT,
                    Name: account.Name,
                    Address: account.Address,
                    Image: account.Image,
                    Gender: account.Gender
                }
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy trang đăng nhập
const getlogin = (req, res, next) => {
    res.render('login');
};

// Kiểm tra đăng nhập
const checklogin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, 'Hnem');
        
        const user = await AccountModel.findById(decoded._id);
        if (!user) {
            return res.status(403).json('Bạn không có quyền');
        }

        req.data = user;
        next();
    } catch (err) {
        return res.status(401).json('Bạn chưa đăng nhập');
    }
};

// Kiểm tra quyền admin
const checkadmin = (req, res, next) => {
    if (req.data.role === 0) {
        next();
    } else {
        res.status(403).json('Bạn không đủ quyền, vui lòng đăng nhập tài khoản admin');
    }
};

// Lấy tất cả tài khoản
const getAll = async (req, res, next) => {
    try {
        const accounts = await AccountModel.find({});
        res.json(accounts);
    } catch (error) {
        res.status(500).json('Lỗi server');
    }
};

// Lấy tài khoản theo ID
const getId = async (req, res, next) => {
    try {
        const account = await AccountModel.findById(req.params.id);
        res.json({
            username: account.username,
            role: account.role,
            SDT: account.SDT,
            Name: account.Name,
            Address: account.Address,
            Image: account.Image,
            Gender: account.Gender
        });
    } catch (error) {
        res.status(500).json('Lỗi server');
    }
};


const addAccount = async (req, res, next) => {
    const { username, password, SDT, Name, Address, Image, Gender, email } = req.body;
    try {
        // Ensure that the password is provided before hashing
        if (!password) {
            return res.status(400).json('Mật khẩu không được để trống');
        }

        // Hash the password with bcrypt
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create the new account
        const newAccount = await AccountModel.create({
            username,
            password: encryptedPassword,
            SDT,
            Name,
            Address,
            Image,
            email,
            Gender
        });

        return res.status(201).json('Thêm account thành công');
    } catch (error) {
        console.error('Lỗi khi thêm account:', error);
        return res.status(500).json('Lỗi server');
    }
};

// Đổi mật khẩu
const changePassword = async (req, res, next) => {
    const { newPassword } = req.body;
    const { id } = req.params;

    try {
        const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);
        const updatedAccount = await AccountModel.findByIdAndUpdate(id, {
            password: encryptedPassword,
        }, { new: true });

        if (!updatedAccount) {
            return res.status(404).json('Tài khoản không tồn tại');
        }

        res.json('Cập nhật mật khẩu thành công');
    } catch (error) {
        res.status(500).json('Lỗi server');
    }
};

const updatedAccount = async (req, res) => {
    const { id } = req.params;
    const { username, password, role, phone, name, address, gender, email, status } = req.body;

    // Kiểm tra ID có hợp lệ không
    if (!id) {
        return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
    }

    // Kiểm tra các trường bắt buộc có được cung cấp đầy đủ không
    // if (!username || !role || !phone || !name || !address || !gender || !email) {
    //     return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tất cả các trường bắt buộc.' });
    // }

    try {
        // Mã hóa mật khẩu mới nếu có sự thay đổi
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Cập nhật tài khoản với các trường thông tin
        const updateData = {
            username,
            role,
            SDT: phone,
            Name: name,
            Address: address,
            Gender: gender,
            email,
            status: status || 'Đã kích hoạt' // Default to 'Đã kích hoạt' if not provided
        };

        // Nếu mật khẩu không thay đổi, loại bỏ trường password khỏi updateData
        if (!hashedPassword) {
            delete updateData.password;
        } else {
            updateData.password = hashedPassword; // Thêm mật khẩu đã mã hóa vào updateData
        }

        // Loại bỏ các trường không thay đổi
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined || updateData[key] === '') {
                delete updateData[key];
            }
        });

        const result = await AccountModel.updateOne({ _id: id }, updateData);

        // Kiểm tra kết quả cập nhật
        if (result.nModified > 0) {
            return res.json({ success: true, message: 'Tài khoản đã được cập nhật thành công!' });
        } else  {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản để sửa.' });
        }
    } catch (error) {
        console.error('Error updating account:', error);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
    }
};


// Xóa tài khoản
const deleteAccount = async (req, res, next) => {
    try {
        const { id } = req.params;
        await AccountModel.deleteOne({ _id: id });
        res.json('Xóa thành công');
    } catch (error) {
        res.status(500).json('Lỗi server');
    }
};

// Phân trang tài khoản
const page_size = 5;
const phantrangAccount = async (req, res, next) => {
    const { page = 1 } = req.query;
    const skipAmount = (page - 1) * page_size;

    try {
        const accounts = await AccountModel.find({})
            .skip(skipAmount)
            .limit(page_size);
        res.json(accounts);
    } catch (error) {
        res.status(500).json('Lỗi server');
    }
};

module.exports = {
    register,
    getlogin,
    postlogin,
    getAll,
    getId,
    updatedAccount,
    addAccount,
    changePassword,
    deleteAccount,
    checklogin,
    checkadmin,
    phantrangAccount,
};
