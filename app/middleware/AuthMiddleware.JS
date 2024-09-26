const jwt = require('jsonwebtoken');

// Middleware to check if the user is logged in
const checkAuthentication = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/api/account/login'); // Redirect to login if no token is found
    }

    try {
        const decoded = jwt.verify(token, 'Hnem'); // Verify the token
        req.user = decoded; // Attach user data to the request
        next(); // Continue to the requested route
    } catch (err) {
        return res.redirect('/api/account/login'); // Redirect to login if token is invalid
    }
};
