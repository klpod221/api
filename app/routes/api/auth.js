const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../../middleware/AuthMiddleware');

const AuthController = require('../../controllers/AuthController');
const UserValidator = require('../../validators/UserValidator');

router.post('/register', UserValidator.AuthValidate, AuthController.create);
router.post('/login', UserValidator.AuthValidate, AuthController.login);
router.get('/profile', AuthMiddleware, AuthController.profile);

module.exports = router;