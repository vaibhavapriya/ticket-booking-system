const jwt = require('jsonwebtoken');

exports.validateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token is required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set req.user after decoding the token
        console.log(req.user); // Now req.user will contain the decoded information
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

