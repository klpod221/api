const express = require('express');
const router = express.Router();

const ContactController = require('../../controllers/ContactController');
const ContactValidator = require('../../validators/ContactValidator');

router.post('/', ContactValidator.ContactValidate, ContactController.contact);

module.exports = router;