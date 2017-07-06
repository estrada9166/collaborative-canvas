var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Canvas_test', new Schema({
  name: String,
  image: String,
  users: [String]
}))