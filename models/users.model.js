const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Users = new mongoose.Schema({
   userName: {
      type: String,
      required: true,
      match: [RegExp(/[a-zA-Z0-9]$/), 'Name only contain a-z and 1-9'],
   },
   email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
         validator: validator.isEmail,
         message: '{VALUE} is not a valid email',
      },
   },
   password: { type: String, required: true, unique: true },
   admin: {type: Boolean, required: true, default: false},
   editor: {type: Boolean, required: true, default: false}
});

Users.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   try {
       const salt = await bcrypt.genSalt(Number(process.env.SALT_PASS));
       this.password = await bcrypt.hash(this.password, salt);
       return next();
   } catch (err) {
       return next(err);
   }
});

module.exports = mongoose.model('Users', Users);
