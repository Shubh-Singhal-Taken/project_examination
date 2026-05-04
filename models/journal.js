const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    destination: { type: String, required: true, immutable: true },
    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    experience: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Journal', journalSchema);
