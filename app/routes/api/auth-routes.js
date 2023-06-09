const express = require('express');
const router = express.Router();

const AuthController = require('../../controllers/AuthController');
const UserValidator = require('../../validators/UserValidator');

router.post('/register', UserValidator.AuthValidate, AuthController.create);
router.post('/login', UserValidator.AuthValidate, AuthController.login);
router.get('/profile', AuthController.profile);
router.get('/logout', AuthController.logout);

module.exports = router;