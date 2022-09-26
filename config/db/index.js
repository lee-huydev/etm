const mongoose = require('mongoose');

const connect = async () => {
   try {
      await mongoose.connect(process.env.DB_MONGODB_URL);
      console.log('Connect successfully');
   } catch (error) {
      console.log('Connect failure!' + error);
   }
};

module.exports = { connect };
