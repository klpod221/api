// import the express router
const express = require('express');
const router = express.Router();

// import all routes
const authRoutes = require('./api/auth-routes');
const contactRoutes = require('./api/contact-routes');

// use all routes
router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

module.exports = router;