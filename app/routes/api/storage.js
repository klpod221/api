const express = require('express');
const router = express.Router();

const StorageController = require('../../controllers/StorageController');

router.post('/upload', StorageController.upload);

module.exports = router;
