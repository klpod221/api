const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, trim: true, minlength: 8 },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null }
});

module.exports = mongoose.model('User', UserSchema);