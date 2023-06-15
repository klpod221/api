const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization').replace('Bearer ', '');

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get expired time
        const expiredTime = decoded.exp;
        const now = new Date();

        if (!decoded || now.getTime() > expiredTime * 1000) {
            return res.status(401).json({ message: 'Unauthorized!' });
        }

        req.jwt = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized!' });
    }
}