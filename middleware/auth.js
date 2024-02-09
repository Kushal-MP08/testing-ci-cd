const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    const token = req.headers['x-auth-token'];
    if (!token) return res.status(401).send('Access Denied. No token provided.');
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}