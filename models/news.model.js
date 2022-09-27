const mongoose = require('mongoose');


const News = new mongoose.Schema({
   title: { type: String, minLength: 50, maxLength: 255, required: true },
   description: { type: String, required: true },
   image: {
      type: String,
      required: true,
   },
   create_at: { type: String, required: true, default: Date.now },
});

module.exports = mongoose.model('News', News);
