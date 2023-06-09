const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, trim: true, required: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, trim: true, minlength: 8 },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    role: { type: String, enum: ['admin', 'user', 'guest'], default: 'guest' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null }
});

module.exports = mongoose.model('User', UserSchema);
