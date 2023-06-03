const User = require('../models/UserModel');

/**
 * Validator for creating a new user
 * 
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.AuthValidate = (req, res, next) => {
    // validate rules
    req.check('email', 'Email is required!').notEmpty();
    req.check('email', 'Invalid Email!').isEmail();
    req.check('password', 'Password is required!').notEmpty();
    req.check('password', 'Password must be at least 8 characters!').isLength({ min: 8 });

    // Check for errors
    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).json(errors);
    }

    next();
};