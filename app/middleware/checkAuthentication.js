const jwt = require('jsonwebtoken');

// Middleware to check if the user is logged in and has the appropriate role
const checkAuthentication = (req, res, next) => {
    const token = req.cookies.token; // Access the token from the cookies

    if (!token) {
        // If no token is present in the cookies, redirect to login
        return res.redirect('/api/account/login');
    }

    try {
        const decoded = jwt.verify(token, 'Hnem'); // Verify the token using the secret key
        req.user = decoded; // Attach the decoded token (user data) to the request

        // Check the role of the user
        if (req.user.role === 'Admin') {
            // Admin users have full access
            next();
        } else {
            // Non-admin users have restricted access
            return res.redirect('http://localhost:5000/');
        }
    } catch (err) {
        // If token verification fails, redirect to login
        return res.redirect('/api/account/login');
    }
};

module.exports = checkAuthentication; 
