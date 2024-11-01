const jwt = require('jsonwebtoken');
const AccountModel = require('../models/accountModel');

// Middleware to check if user is logged in and extract role
const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
        }

        const decoded = jwt.verify(token, 'Hnem');
        const user = await AccountModel.findById(decoded._id);

        if (!user) {
            return res.status(403).json({ message: 'Người dùng không tồn tại' });
        }

        req.user = user; // Attach user to the request
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

// Middleware to authorize based on roles
const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bạn không đủ quyền để truy cập' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
