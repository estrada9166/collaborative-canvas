process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User  = require('../models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('User', () => {
  beforeEach((done) => {
      User.remove({}, (err) => { 
          done();         
      });     
  });

  describe('/POST new user', () => {
    it('it should not POST a new user without userName', (done) => {
      let user = {
        email: 'test@test.com',
        password: 'test',
      }
      chai.request(server)
        .post('/api/user')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('userName');
          res.body.errors.userName.should.have.property('kind').eql('required');
          done()
        })
    });

    it('it should create a new user', (done) => {
      let user = {
        email: 'test@test.com',
        userName: 'test',
        password: 'test',
      }
      chai.request(server)
        .post('/api/user')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done()
        })
    })
  })

  describe('/POST auth a user', () => {
    it('it should auth a user', (done) => {
      let user = new User({email: 'e@a.com', userName: 'e', password: 'test', token: 123456789})
      let logData = { emailorusername: 'e', password: 'test'}
      user.save((err, user) => {
        chai.request(server)
          .patch('/api/authenticate')
          .send(logData)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })

      })
    })
  })
})