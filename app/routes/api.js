// import the express router
const express = require('express');
const router = express.Router();

// import the auth middleware
const AuthMiddleware = require('../middleware/AuthMiddleware');

// import all routes
const authRoutes = require('./api/auth-routes');
const contactRoutes = require('./api/contact-routes');
const projectRoutes = require('./api/project-routes');
const adminProjectRoutes = require('./api/admin/project-routes');

// use all routes
router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/projects', projectRoutes);
router.use('/admin/projects', AuthMiddleware, adminProjectRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

module.exports = router;