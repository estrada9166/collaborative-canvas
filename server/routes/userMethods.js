let mongoose    = require('mongoose');
let bcrypt      = require('bcrypt');
var jwt         = require('jsonwebtoken');


let User    = require('../models/user');

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

const authenticateWithUsername = ({emailorusername}, callback) => {
  User.findOne({
    userName: emailorusername
  }, (err, user) => {
    callback(err, user)
  })
};

const authenticateWithEmail = ({emailorusername}, callback) => {
  User.findOne({
    email: emailorusername
  }, (err, user) => {
    callback(err, user)
  })
};

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

const updateToken = (user) => {
  var token = jwt.sign(user, 'superSecret', {
    expiresIn: 1440
  })

  user['token'] = token;

  return user.save((err, user) => {
    if(err) res.send(err);
    return user;
  })
}

module.exports = { 
  findUserByEmail, 
  findUserByUsername, 
  findUserByToken, 
  authenticateWithUsername, 
  authenticateWithEmail, 
  createUser,
  updateToken,
}