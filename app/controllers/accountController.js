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
const nodemailer = require('nodemailer');
const crypto = require('crypto');


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
        // Tìm tài khoản theo tên đăng nhập
        const account = await AccountModel.findOne({ username });

        if (!account) {
            return res.status(401).json({ message: 'Tài khoản không tồn tại hoặc không chính xác' });
        }

        // Kiểm tra mật khẩu
        const checkPassword = bcrypt.compareSync(password, account.password);
        if (!checkPassword) {
            return res.status(401).json({ message: 'Mật khẩu không chính xác' });
        }

        // Tạo JWT token
        const token = jwt.sign({ _id: account._id }, 'Hnem', { expiresIn: '1d' });

        // Lưu token vào cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 ngày

        // Trả về dữ liệu người dùng cho frontend
        return res.json({
            message: 'Đăng nhập thành công',
            userData: {
                _id: account._id, // Lưu ý đổi thành _id để thống nhất với MongoDB
                username: account.username,
                role: account.role,
                SDT: account.SDT,
                Name: account.Name,
                Address: account.Address,
                image: account.image, // URL ảnh
                Gender: account.Gender
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra, vui lòng thử lại.' });
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

const getId = async (req, res) => {
    try {
        const accountId = req.params._id;

        // Validate if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            console.error('Invalid account ID format'); // Debugging log
            return res.status(400).json({ message: 'ID tài khoản không hợp lệ' }); // Invalid account ID
        }

        // Find the account by ID
        const account = await AccountModel.findById(accountId);
        if (!account) {
            console.warn(`Account not found for ID: ${accountId}`); // Debugging log
            return res.status(404).json({ message: 'Tài khoản không tồn tại' }); // Account not found
        }

        // Destructure the fields to send to the frontend
        const { username, role, SDT, Name, Address, image, Gender, email } = account;

        res.status(200).json({ username, role, SDT, Name, Address, image, Gender, email});

    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ message: 'Lỗi server' }); // Server error
    }
};
    
const addAccount = async (req, res, next) => {
    // Lấy thông tin từ req.body và req.file
    const { username, password, SDT, Name, Address, Gender, email, role, status } = req.body;
    const image = req.file ? req.file.path : null; // Get the image path

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
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'your-email@gmail.com',  // Your Gmail address
//       pass: 'your-app-password',     // The 16-digit app password
//     },
//   });
  
//   const mailOptions = {
//     from: 'your-email@gmail.com',
//     to: 'recipient@example.com',
//     subject: 'Password Reset',
//     text: 'Click the link to reset your password.',
//   };
  
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log('Error:', error);
//     }
//     console.log('Email sent:', info.response);
//   });

async function forgotPassword(req, res) {
    const { email } = req.body; // Make sure email is defined

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const user = await AccountModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex'); // Generate a random token

        // Set up the email options
        const mailOptions = {
            from: 'your_email@gmail.com',
            to: email, // Use the email variable here
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset: http://localhost:3001/reset-password/${token}`,
        };

        // Attempt to send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Reset email sent successfully' });
    } catch (error) {
        console.error('Error fetching user or sending email:', error);
        return res.status(500).json({ message: 'An error occurred while processing your request.', error: error.message });
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await AccountModel.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set new password and clear reset token
        user.password = newPassword; // Hash the password before saving it
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully!' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password.' });
    }
};
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    // Kiểm tra xem các trường có được nhập đầy đủ không
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    // Kiểm tra mật khẩu mới có đủ độ dài không (ví dụ: tối thiểu 6 ký tự)
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }

    try {
        // Tìm tài khoản theo ID
        const account = await AccountModel.findById(id);

        if (!account) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }

        // Kiểm tra xem mật khẩu cũ có đúng không
        const isMatch = await bcrypt.compare(oldPassword, account.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
        }

        // Băm mật khẩu mới và cập nhật vào DB
        const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);
        account.password = encryptedPassword;
        await account.save(); // Lưu lại tài khoản

    } catch (error) {
        console.error('Lỗi server:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};


const updatedthongtin = async (req, res) => {
    const { id } = req.params;
    const { username, role, phone, name, address, gender, email, status } = req.body;
    const image = req.file ? req.file.path : null; // Get new image path if uploaded

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

        // Validate email and phone formats
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ success: false, message: 'Email không hợp lệ.' });
        }
        if (phone && !/^\d{10,11}$/.test(phone)) {
            return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ.' });
        }

        // Construct update object dynamically
        const updateData = {
            ...(username && username !== currentAccount.username && { username }),
            ...(role && role !== currentAccount.role && { role }),
            ...(phone && phone !== currentAccount.SDT && { SDT: phone }),
            ...(name && name !== currentAccount.Name && { Name: name }),
            ...(address && address !== currentAccount.Address && { Address: address }),
            ...(gender && gender !== currentAccount.Gender && { Gender: gender }),
            ...(email && email !== currentAccount.email && { email }),
            ...(status !== undefined && { status }), // Update if status is provided
            ...(image && { image }), // Update image if uploaded
        };

        // If no changes, return early
        if (Object.keys(updateData).length === 0) {
            return res.json({ success: true, message: 'Không có thay đổi nào được thực hiện.' });
        }

        // Update the account
        const updatedAccount = await AccountModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        return res.json({
            success: true,
            message: 'Tài khoản đã được cập nhật thành công!',
            account: updatedAccount,
        });

    } catch (error) {
        console.error('Error updating account:', error);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
    }
};
const updatedAccount = async (req, res) => {
    const { id } = req.params;
    const { username, role, phone, Name, Address, Gender, email, status } = req.body;
    const image = req.file ? req.file.path : null;

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
        if (Name !== undefined && Name !== currentAccount.Name) {
            updateData.Name = Name;
        }
        if (Address !== undefined && Address !== currentAccount.Address) {
            updateData.Address = Address;
        }
        if (Gender !== undefined && Gender !== currentAccount.Gender) {
            updateData.Gender = Gender;
        }
        if (email !== undefined && email !== currentAccount.email) {
            updateData.email = email;
        }
        if (status !== undefined) {
            updateData.status = status;
        }
        if (image) {
            updateData.image = image;
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
    updatedthongtin,
    forgotPassword,
    resetPassword
};