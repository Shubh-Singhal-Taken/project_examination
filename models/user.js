const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    nationality: { type: String, required: true },
    travelStyle: {
        type: String,
        enum: ['Adventure', 'Luxury', 'Backpacker', 'Cultural', 'Beach'],
        required: true
    },
    favoriteContinent: {
        type: String,
        enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica'],
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
