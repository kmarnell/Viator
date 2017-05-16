const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');
mongoose.connect('mongodb://localhost/greenfield');
// mongoose.connect('mongodb://group:Hackreactor21@ds127101.mlab.com:27101/greenfield');
mongoose.Promise = require('bluebird');
const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});


const userSchema = mongoose.Schema({

    user: String,
    month: String,
    day: String,
    year: String,
    Airline: String,
    flight: String,
    destination: String

  });

userSchema.plugin(findOrCreate);


const historyStorage = mongoose.model('historyStorage', userSchema);


module.exports = historyStorage;
