// import the express router
const express = require('express');
const router = express.Router();

// import the auth middleware
const AuthMiddleware = require('../middleware/AuthMiddleware');

// import all routes
const authRoutes = require('./api/auth');
const contactRoutes = require('./api/contact');
const projectRoutes = require('./api/projects');
const storageRoutes = require('./api/storage');

// import admin routes
const adminProjectRoutes = require('./api/admin/projects');

// use all routes
router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/projects', projectRoutes);
router.use('/storage', AuthMiddleware, storageRoutes);

// use admin routes
router.use('/admin/projects', AuthMiddleware, adminProjectRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

module.exports = router;