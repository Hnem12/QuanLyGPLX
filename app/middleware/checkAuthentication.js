const jwt = require('jsonwebtoken');
const { default: api } = require('../../react/quanlygplx/src/utils/request');

 Danh sách quyền cho từng vai trò
const rolePermissions = {
    'User': ['/Gioithieu'],
    'Admin': ['/licenseHolder', '/ApprovelicenselHoder', '/renewals', '/renew', '/kiemdinhGPLX', '/account', '/truyxuatbanglaixeoto', '/trangchu'],
    'Director Admin': ['/licenseHolder', '/ApprovelicenselHoder', '/renewals', '/renew', '/kiemdinhGPLX', '/truyxuatbanglaixeoto', '/trangchu'],
    'Test Admin': ['/ApprovelicenselHoder', '/renewals', '/renew', '/trangchu', '/truyxuatbanglaixeoto'],
    'Verified Admin': ['/ApprovelicenselHoder', '/renewals', '/renew', '/kiemdinhGPLX', '/truyxuatbanglaixeoto', '/trangchu']
};

Middleware kiểm tra xác thực và phân quyền
const checkAuthentication = (req, res, next) => {
   const token = req.cookies.token; // Lấy token từ cookies

     if (!token) {
         return res.redirect('/'); // Nếu không có token, chuyển hướng về trang đăng nhập
     }

     try {
         const decoded = jwt.verify(token, 'Hnem'); // Giải mã token
         req.user = decoded; // Gán thông tin người dùng vào request
         const { role } = req.user; // Lấy vai trò của người dùng

         // Nếu là User, chuyển hướng về trang localhost:5000
         if (role === 'User') {
             return res.redirect(api.baseURLFE);
         }

         // Kiểm tra quyền dựa trên danh sách rolePermissions
         const allowedPaths = rolePermissions[role] || [];
        
         // Truyền allowedPaths vào res.locals để sử dụng trong EJS
         res.locals.userRole = role;
         res.locals.allowedPaths = allowedPaths;

         if (allowedPaths.includes(req.path)) {
             return next(); // Nếu có quyền, tiếp tục xử lý request
         }

         // Nếu không có quyền truy cập, chuyển hướng về trang chủ
         return res.redirect('/trangchu');
     } catch (err) {
         return res.redirect('/api/account/login'); // Nếu token không hợp lệ, chuyển về trang đăng nhập
     }
};

module.exports = checkAuthentication;
