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

const register = async (req, res) => {
    try {
        const { username, password, role, SDT, Name, Address, Gender, email, status } = req.body;
        const image = req.file ? req.file.path : null; // Get the image path

        // Validate required fields
        if (!username || !password || !email || !image) { // Check for required fields
            return res.status(400).json({ message: 'Missing required fields!' });
        }

        // Check if the user or email already exists
        const existingUser = await AccountModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the new user account
        const newUser = await AccountModel.create({
            username,
            password: hashedPassword,
            role,
            SDT,
            Name,
            Address,
            Gender,
            email,
            status,
            image, // Save image path to MongoDB
        });

        res.status(201).json({ message: 'Account created successfully!', user: newUser });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Account creation failed!', error: error.message });
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
        }

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
                image: account.image, // Image URL
                Gender: account.Gender
            }
        });
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
    // Lấy thông tin từ req.body và req.file
    const { username, password, SDT, Name, Address, Gender, email, role, status } = req.body;
    const image = req.file ? req.file.path : null; // Get the image path

    console.log('Received account data:', {
        username,
        password,
        SDT,
        Name,
        Address,
        Gender,
        email,
        role,
        status,
        image
    });

    try {
        // Kiểm tra các trường bắt buộc
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

        // Kiểm tra xem tên người dùng hoặc email đã tồn tại hay chưa
        const existingAccount = await AccountModel.findOne({ $or: [{ username }, { email }] });
        if (existingAccount) {
            return res.status(400).json({ success: false, message: 'Tên người dùng hoặc email đã tồn tại' });
        }

        // Mã hóa mật khẩu
        let encryptedPassword;
        try {
            encryptedPassword = await bcrypt.hash(password, saltRounds);
        } catch (error) {
            console.error('Lỗi khi mã hóa mật khẩu:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi mã hóa mật khẩu' });
        }

        // Tạo tài khoản mới
        const newAccount = await AccountModel.create({
            username,
            password: encryptedPassword,
            SDT,
            Name,
            Address,
            image, // Save image path to MongoDB
            email,
            Gender,
            role,
            status,
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
    const image = req.file ? req.file.path : null; // Lấy đường dẫn hình ảnh mới (nếu có)

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

        // Validate fields
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ success: false, message: 'Email không hợp lệ' });
        }
        if (phone && !/^\d{10,11}$/.test(phone)) {
            return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ' });
        }

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
        if (image) {
            updateData.image = image; // Cập nhật đường dẫn hình ảnh
        }

        // Hash new password only if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // If there is nothing to update, return a message
        if (Object.keys(updateData).length === 0) {
            return res.json({ success: true, message: 'Không có thay đổi nào được thực hiện.' });
        }

        // Update the account
        const updatedAccount = await AccountModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });

        return res.json({ success: true, message: 'Tài khoản đã được cập nhật thành công!', account: updatedAccount });

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

const Xulyanh = async (req, res, next) => {
  console.log(req.file.filename);
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
    Xulyanh
};