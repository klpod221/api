// import the express router
const express = require('express');
const router = express.Router();
const path = require('path');

// import the web public routes
const publicRoutes = require('./web/public');

// use the public routes
router.use('/', publicRoutes);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;