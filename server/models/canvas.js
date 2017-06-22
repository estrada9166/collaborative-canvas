var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Canvas', new Schema({
  name: String,
  image: String,
  users: [String]
}))