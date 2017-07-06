var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  email:  { type: String, required: true },
  userName:  { type: String, required: true },
  password:  { type: String, required: true },
  token: String
}))