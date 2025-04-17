const jwt = require('jsonwebtoken');
const { default: API } = require('../../react/quanlygplx/src/utils/request');

// Danh sách quyền cho từng vai trò
const rolePermissions = {
    'User': ['/gioithieu', '/giahanGPLX','/caplaiGPLX','/taokhoa'],
    'Admin': ['/account','/trangchu'],
    'Director Admin': ['/licenseHolder', '/ApprovelicenselHoder', '/renewals', '/renew', '/kiemdinhGPLX', '/truyxuatbanglaixeoto', '/trangchu'],
    'Test Admin': ['/ApprovelicenselHoder', '/renewals', '/renew', '/trangchu', '/truyxuatbanglaixeoto'],
    'Verified Admin': ['/ApprovelicenselHoder', '/renewals', '/renew', '/kiemdinhGPLX', '/truyxuatbanglaixeoto', '/trangchu']
};

// Middleware kiểm tra xác thực và phân quyền
const checkAuthentication = (req, res, next) => {
    const token = req.cookies.token; // Lấy token từ cookies

    if (!token) {
        return res.redirect('/'); // Nếu không có token, chuyển hướng về trang đăng nhập
    }

    try {
        const decoded = jwt.verify(token, 'Hnem'); // Giải mã token
        req.user = decoded; // Gán thông tin người dùng vào request
        const { role } = req.user; // Lấy vai trò của người dùng

        // Kiểm tra quyền dựa trên danh sách rolePermissions
        const allowedPaths = rolePermissions[role] || [];
        res.locals.userRole = role;
        res.locals.allowedPaths = allowedPaths;

        // Nếu vai trò không có trong danh sách rolePermissions, không cấp token
        if (!rolePermissions[role]) {
            return res.redirect('/');
        }

        // Nếu là User, vẫn cấp token và chuyển hướng về frontend
        if (role === 'User') {
            // Kiểm tra xem có accountId trong token hay không
            const accountId = decoded.accountId || decoded._id || decoded.userId;
            
            if (accountId) {
                // Đặt accountId trong cookie trước khi chuyển hướng
                res.cookie('accountId', accountId, { 
                    httpOnly: false, // Cho phép JavaScript truy cập
                    secure: process.env.NODE_ENV === 'production', 
                    maxAge: 24 * 60 * 60 * 1000 // 1 ngày tính bằng mili giây
                });
                console.log(`Đã lưu accountId ${accountId} vào cookie`);
            } else {
                console.log('Không tìm thấy accountId trong token');
            }
    
             return res.redirect(API.BASEURLFE);
        }

        // Nếu có quyền, tiếp tục xử lý request
        if (allowedPaths.includes(req.path)) {
            return next();
        }

        // Nếu không có quyền truy cập, chuyển hướng về trang chủ
        return res.redirect('/trangchu');
    } catch (err) {
        return res.redirect('/api/account/login'); // Nếu token không hợp lệ, chuyển về trang đăng nhập
    }
};

module.exports = checkAuthentication;
