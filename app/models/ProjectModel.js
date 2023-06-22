const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    thumbnail: { type: String, trim: true, required: true },
    detail: { type: String, trim: true, required: true },
    data: { type: String, trim: true, required: true },
    publish: { type: Boolean, default: false },
    status: { type: String, enum: ['complete', 'continue', 'inactive'], default: 'inactive' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
