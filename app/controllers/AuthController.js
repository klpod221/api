const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Create a new user
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.create = async (req, res, next) => {
    try {
        // Check if email already exists
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        // If email does not exist, create a new user
        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        // Save the user
        await newUser.save();

        res.status(201).json({ message: 'User created successfully!' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/**
 * User login
 * 
 * @param {*} req
 * @param {*} res
 */
exports.login = async (req, res) => {
    try {
        if (req.session && req.session.user) {
            return res.status(400).json({ message: 'User already logged in!' });
        }

        // Check if email exists
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ message: 'Email does not exist!' });
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password!' });
        }

        // check if user is active
        if (user.status !== 'active') {
            return res.status(400).json({ message: 'User is not active!' });
        }

        const accessToken = generateAccessToken(user);

        return res.status(200).json({
            message: 'User logged in successfully!', 
            accessToken: accessToken,
            expiresIn: 60 * 60 * 24 // expires in 24 hours
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 }); // expires in 24 hours
};

/**
 * Get user data
 * 
 * @param {*} req
 * @param {*} res
 */
exports.profile = async (req, res) => {
    try {
        // get user data from request
        const userId = req.jwt.userId;

        // get user data from database
        const user = await User.findOne({ _id: userId });

        if (user) {
            return res.status(200).json({ 
                message: 'User data retrieved successfully!',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
             });
        }

        return res.status(400).json({ message: 'User not logged in!' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
