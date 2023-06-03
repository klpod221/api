// import the express router
const express = require('express');
const router = express.Router();

// import all routes
const authRoutes = require('./api/auth-routes');

// use all routes
router.use('/auth', authRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

module.exports = router;