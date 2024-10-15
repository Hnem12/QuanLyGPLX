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

const getId = async (req, res, next) => {
    try {
        const account = await AccountModel.findById(req.params.id);
        if (!account) {
            return res.status(404).json('Tài khoản không tồn tại'); // Account not found
        }
        res.json({
            username: account.username,
            role: account.role,
            SDT: account.SDT,
            Name: account.Name,
            Address: account.Address,
            Image: account.Image,
            Gender: account.Gender,
            password: account.password // Include hashed password for comparison
        });
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json('Lỗi server');
    }
};
    

const addAccount = async (req, res, next) => {
    const { username, password, SDT, Name, Address, Image, Gender, email, role, status } = req.body;

    try {
        // Validate required fields
        if (!username || username.trim() === "") {
            return res.status(400).json({ success: false, message: 'Tên người dùng không được để trống' });
        }
        if (!password || password.trim() === "") {
            return res.status(400).json({ success: false, message: 'Mật khẩu không được để trống' });
        }
        if (!SDT || !/^\d{10,11}$/.test(SDT)) {
            return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ' });
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ success: false, message: 'Email không hợp lệ' });
        }
        if (!Name || Name.trim() === "") {
            return res.status(400).json({ success: false, message: 'Tên không được để trống' });
        }
        if (!Address || Address.trim() === "") {
            return res.status(400).json({ success: false, message: 'Địa chỉ không được để trống' });
        }

        // Check if username or email already exists
        const existingAccount = await AccountModel.findOne({ $or: [{ username }, { email }] });
        if (existingAccount) {
            return res.status(400).json({ success: false, message: 'Tên người dùng hoặc email đã tồn tại' });
        }

        // Hash the password
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
            Gender,
            role,
            status
        });

        return res.status(201).json({ success: true, message: 'Thêm tài khoản thành công', account: newAccount });
    } catch (error) {
        console.error('Lỗi khi thêm tài khoản:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
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

    // Check if ID is valid
    if (!id) {
        return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
    }

    try {
        // Fetch the current account data
        const currentAccount = await AccountModel.findById(id);
        if (!currentAccount) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản.' });
        }

        // Prepare data for update
        const updateData = {};

        // Only update fields if they have changed
        if (username !== undefined && username !== currentAccount.username) {
            updateData.username = username;
        }
        if (role !== undefined && role !== currentAccount.role) {
            updateData.role = role;
        }
        if (phone !== undefined && phone !== currentAccount.SDT) {
            updateData.SDT = phone;
        }
        if (name !== undefined && name !== currentAccount.Name) {
            updateData.Name = name;
        }
        if (address !== undefined && address !== currentAccount.Address) {
            updateData.Address = address;
        }
        if (gender !== undefined && gender !== currentAccount.Gender) {
            updateData.Gender = gender;
        }
        if (email !== undefined && email !== currentAccount.email) {
            updateData.email = email;
        }
        if (status !== undefined) {
            updateData.status = status; // If status is provided, update it
        }

        // Hash new password only if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Log the update data for debugging
        console.log('Update Data:', updateData);

        // If there is nothing to update, return a message
        if (Object.keys(updateData).length === 0) {
            return res.json({ success: true, message: 'Không có thay đổi nào được thực hiện.' });
        }

        // Update the account
        const result = await AccountModel.updateOne({ _id: id }, { $set: updateData });

        // Check the result of the update
        if (result.nModified > 0) {
            return res.json({ success: true, message: 'Tài khoản đã được cập nhật thành công!' });
        } else {
            return res.json({ success: true, message: 'Không có thay đổi nào được thực hiện hoặc các giá trị đã tồn tại.' });
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