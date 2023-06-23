// import the express router
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/uploads/*', (req, res) => {
    try {
        // check if the file exists
        if (fs.existsSync(path.join(__dirname, '../../public', req.url))) {
            res.sendFile(path.join(__dirname, '../../public', req.url));
        } else {
            throw new Error('File not found');
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;