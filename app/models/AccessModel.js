const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccessSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    latest_login_ip: { type: String, trim: true },
    latest_receive_ip: { type: String, trim: true, required: true },
    first_login: { type: Date, default: null },
    last_login: { type: Date, default: null },
    fail_count: { type: Number, default: 0 },
    lock_until: { type: Date, default: null },
});

module.exports = mongoose.model('Access', AccessSchema);
