const express = require('express');
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

// Set public folder
const staticOptions = {
    dotfiles: 'ignore',
    etag: false,
    index: false,
    maxAge: '1d',
    redirect: false
};

app.use(express.static('public', staticOptions));

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

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

// Listen on port
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = app;
