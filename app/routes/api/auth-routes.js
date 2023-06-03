const express = require('express');
const router = express.Router();

const UserValidator = require('../../validators/UserValidator');
const AuthController = require('../../controllers/AuthController');

router.post('/register', UserValidator.AuthValidate, AuthController.create);
router.post('/login', UserValidator.AuthValidate, AuthController.login);
router.get('/logout', AuthController.logout);

module.exports = router;