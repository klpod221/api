// import the express router
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/public/*', (req, res) => {
    // send all public files from the public folder
    res.sendFile(path.join(__dirname, '../../public', req.params[0]));
});

module.exports = router;