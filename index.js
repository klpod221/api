const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Routes
const apiRoutes = require('./app/routes/api');
const webRoutes = require('./app/routes/web');

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

// Initialize MongoDB
const db = mongoose.connection;

// Connect to MongoDB
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Check if MongoDB is connected
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// use json
app.use(express.json());

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// rate limiter
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many requests, please try again later.'
        });
    },
    skip: (req, res) => {
        if(req.ip === '::ffff:127.0.0.1')
            return true;
        return false;
    }
});
app.use(limiter);

// allow cross origin requests from the frontend
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

// Sessions
app.use(session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: true,
        // secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    },
    saveUninitialized: false,
    resave: false,
    unset: 'destroy',
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        collectionName: 'sessions'
    })
}));

// Api Routes
app.use('/api', apiRoutes);

// Web Routes
app.use('/', webRoutes);

// use cors for cross origin requests
// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: '404 - Not Found' });
});

// Listen on port
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = app;
