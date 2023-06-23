const jwt = require('jsonwebtoken');

const RoleMiddleware = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    // get roles from jwt
    try {
        // Get token from header
        const token = req.header('Authorization').replace('Bearer ', '');

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // check if user has role
        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(401).json({ message: 'Unauthorized!' });
        }

        req.jwt = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized!' });
    }
}

module.exports = RoleMiddleware;
