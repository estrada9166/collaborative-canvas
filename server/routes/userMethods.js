let mongoose    = require('mongoose');
let bcrypt      = require('bcrypt');
var jwt     = require('jsonwebtoken');


//let User    = require('../models/user');
// user collection for tests
let User  = require('../models/User_test');

const findUserByEmail = ({email}, callback) => {
  User.findOne({
    email
  }, (err, user) => {
    callback(err, user)
  })
};

const findUserByUsername = ({userName}, callback) => {
  User.findOne({
    userName
  }, (err, user) => {
    callback(err, user)
  })
}

const findUserByToken = ({token}, callback) => {
  User.findOne({
    token
  }, (err, user) => {
    callback(err, user)
  })
}

const createUser = ({ email, userName, password }, res) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User()
  newUser.email = email;
  newUser.userName = userName;
  newUser.password = hash;

  var token = jwt.sign(newUser, 'superSecret', {
    expiresIn: 1440
  })
  
  newUser.token = token;

  return newUser.save((err, user) => {
    if(err) res.send(err);
    return user
  })
}

module.exports = { findUserByEmail, findUserByUsername, findUserByToken, createUser }