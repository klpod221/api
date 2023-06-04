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

// allow cross origin requests
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        collectionName: 'sessions'
    })
}));

// Api Routes
app.use('/api', apiRoutes);

// Web Routes
app.use('/', webRoutes);

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
