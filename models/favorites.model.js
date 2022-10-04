const mongoose = require('mongoose');

const Favorites = new mongoose.Schema({
    currentUserId: { type: String, required: true },
    postId: { type: String, required: true},
    create_at: { type: String, required: true, default: Date.now },
});

module.exports = mongoose.model('Favorites', Favorites);
