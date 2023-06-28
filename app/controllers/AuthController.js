const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/UserModel');
const Access = require('../models/AccessModel');

/**
 * Create a new user
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.create = async (req, res, next) => {
    try {
        let username = req.body.username;
        
        if (!username) {
            username = req.body.email.split('@')[0];
        }
        
        // Check if email and username already exist
        const user = await User.findOne({
            $or: [
                { email: req.body.email },
                { username: username }
            ]
        });

        if (user) {
            return res.status(400).json({ message: 'Email or username already exist!' });
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

        // Check if user is locked
        const access = await Access.findOne({ user_id: user._id });
        if (!access) {
            const newAccess = new Access({
                user_id: user._id,
                latest_receive_ip: req.ip
            });
            await newAccess.save();
        }

        if (access.lock_until && access.lock_until > Date.now()) {
            const lockRemainingTime = Math.floor((access.lock_until - Date.now()) / 1000);
            return res.status(400).json({ message: `User is locked! Please try again in ${lockRemainingTime} seconds!` });
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            const lockTime = 60 * 1000; // 1 minute
            const failTimeARow = 3;
            const maxFail = 5;
            let message = 'Password is incorrect!';

            // increase fail count
            access.fail_count += 1;
            
            // if fail count is greater than or equal to max fail, lock the user
            // if fail 3 times in a row, lock the user for 1 minute
            if (access.fail_count >= maxFail * failTimeARow) {
                user.status = 'inactive';
                access.lock_until = null;
                message = 'Too many failed attempts! Your account has been deactivated! Please contact the administrator!';
            } else if (access.fail_count % failTimeARow === 0) {
                access.lock_until = Date.now() + 60 * 1000; // lock for 1 minute
                message = `Too many failed attempts! User will be locked for 1 minute!`;
            }

            await user.save();
            await access.save();

            return res.status(400).json({ message: message });
        }

        // check if user is active
        if (user.status !== 'active') {
            return res.status(400).json({ message: 'Your account is not active! Please contact the administrator!' });
        }

        // update access data
        access.latest_login_ip = req.ip;
        access.first_login = access.first_login ? access.first_login : Date.now();
        access.last_login = Date.now();
        access.fail_count = 0;
        access.lock_until = null;

        await access.save();

        // generate access token
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

/**
 * User logout
 * 
 * @param {*} req
 * @param {*} res
 */
exports.logout = async (req, res) => {
    res.status(200).json({ message: 'User logged out successfully!' });
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
                    username: user.username,
                    email: user.email,
                    role: user.role,
                }
             });
        }

        return res.status(400).json({ message: 'User not logged in!' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
