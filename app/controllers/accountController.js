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

// Tạo tài khoản
const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password, role, SDT, Name, Address, Image, Gender } = req.body;
        
        const existingUser = await AccountModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json('User này đã tồn tại');
        }
    
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = await AccountModel.create({
            username,
            password: encryptedPassword,
            role,
            SDT,
            Name,
            Address,
            Image,
            Gender
        });
    
        return res.json('Tạo tài khoản thành công');
    } catch (error) {
        console.error('Lỗi khi tạo tài khoản:', error);
        return res.status(500).json('Tạo tài khoản thất bại');
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

// Thêm tài khoản
const addAccount = async (req, res, next) => {
    const { username, password, SDT, Name, Address, Image, Gender } = req.body;
    try {
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        const newAccount = await AccountModel.create({
            username,
            password: encryptedPassword,
            SDT,
            Name,
            Address,
            Image,
            Gender
        });
        res.json('Thêm account thành công');
    } catch (error) {
        res.status(500).json('Lỗi server');
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
    addAccount,
    changePassword,
    deleteAccount,
    checklogin,
    checkadmin,
    phantrangAccount,
};
