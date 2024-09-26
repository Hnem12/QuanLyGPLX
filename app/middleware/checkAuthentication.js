const jwt = require('jsonwebtoken');

// Middleware to check if the user is logged in
const checkAuthentication = (req, res, next) => {
    const token = req.cookies.token; // Access the cookie from the request

    if (!token) {
        // If there's no token in the cookies, redirect to login
        return res.redirect('/api/account/login');
    }

    try {
        const decoded = jwt.verify(token, 'Hnem'); // Verify the token
        req.user = decoded; // Attach the decoded token to the request (user data)
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        // If the token is invalid, redirect to login
        return res.redirect('/api/account/login');
    }
};

module.exports = checkAuthentication; 
