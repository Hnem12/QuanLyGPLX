const jwt = require('jsonwebtoken');

// Middleware to check if the user is logged in and has the appropriate role
const checkAuthentication = (req, res, next) => {
    const token = req.cookies.token; // Access the token from the cookies

    if (!token) {
        // If no token is present in the cookies, redirect to login
        return res.redirect('/');
    }

    try {
        const decoded = jwt.verify(token, 'Hnem'); // Verify the token using the secret key
        req.user = decoded; // Attach the decoded token (user data) to the request

        const { role } = req.user;

        if (role === 'User') {
            return res.redirect('http://localhost:5000');
        }

        // Check the requested path and restrict access based on roles
        if (req.path === '/licenseHolder' && (role === 'Admin' || role === 'Admin Giám Đốc')) {
            return next();
        } else if (req.path === '/ApprovelicenselHoder' && (role === 'Admin' || role === 'Admin Sát Hạch' || role === 'Admin Kiểm Định')) {
            return next();
        } else if (req.path === '/renewals' && (role === 'Admin' || role === 'Admin Kiểm Định' || role === 'Admin Sát Hạch')) {
            return next();
        } else if (req.path === '/renew' && (role === 'Admin' || role === 'Admin Sát Hạch' || role === 'Admin Kiểm Định')) {
            return next();
        }else if (req.path === '/kiemdinhGPLX' && (role === 'Admin' || role === 'Admin Kiểm Định')) {
            return next();
        } else if (req.path === '/account' && (role === 'Admin' )) {
            return next();
        } else if (req.path === '/truyxuatbanglaixeoto' ) {
            // All admins can access the home page
            return next();
        } else if (req.path === '/trangchu' ) {
            // All admins can access the home page
            return next();
        } else {
            // If the user role does not have permissions, redirect to a "no access" page or home page
            return res.redirect('/trangchu');
        }

    } catch (err) {
        // If token verification fails, redirect to login
        return res.redirect('/api/account/login');
    }
};

module.exports = checkAuthentication;
