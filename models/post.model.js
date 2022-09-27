const mongoose = require('mongoose');
const { default: isURL } = require('validator/lib/isURL');

const Location = new mongoose.Schema({
   long: {type: Number, required: true},
   lat: {type: Number, required: true}
})

const Posts = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
   title: { type: String, minLength: 50, maxLength: 255, required: true },
   address: { type: String, maxLength: 255, required: true },
   categories: { type: String, required: true },
   description: { type: String, required: true },
   price: { type: String, required: true },
   status: {type: Boolean, required: true, default: false},
   sale_or_rent: {type: String, required: true},
   area: { type: String, required: true },
   phoneNumber: { type: String, require: true },
   image: {
      type: String,
      required: true,
   },
   gallery: { type: Array },
   location: {
      type: Location,
      required: true,
   },
   create_at: { type: String, required: true, default: Date.now },
});

module.exports = mongoose.model('Posts', Posts);
