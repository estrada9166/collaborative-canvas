process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Canvas  = require('../models/canvas');
let User  = require('../models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Canvas', () => {
  beforeEach((done) => {
    Canvas.remove({}, (err) => { 
      done();         
    });     
  });

  describe('/GET canvas', () => {
    it('it should GET all the canvas', (done) => {
      let user = new User({email: 'b@a.com', userName: 'b', password: 'test', token: 12345})
      user.save((err, user) => {
        let canvas = new Canvas();
        canvas.name = "My new Canvas";
        canvas.users.push(user.id);
        canvas.save((err, canvas) => {
          chai.request(server)
            .get(`/api/canvas/?token=${user.token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('success');
              res.body.should.have.property('success').eql(true);
              res.body.should.have.property('canvas');
              res.body.canvas.should.be.a('array'); 
              done();
            })
        })
      })
    });

    describe('/GET/:id canvas', () => {
      it('it should return a canvas with a given id', (done) => {
        let canvas = new Canvas();
        canvas.name = "My new Canvas";
        canvas.users.push(123);
        canvas.save((err, canvas) => {
          chai.request(server)
          .get(`/api/canvas/${canvas.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('success').eql(true);            
            res.body.canvas.should.have.property('name');
            res.body.canvas.should.have.property('users');
            res.body.canvas.should.have.property('_id').eql(canvas.id);            
            done()
          })
        })
      })
    });

    describe('/POST new canvas', () => {
      it('it should create a new canvas', (done) => {
        let user = new User({email: 'c@a.com', userName: 'c', password: 'test', token: 123456})
        user.save((err, user) => {
          chai.request(server)
          .post('/api/canvas')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('success').eql(true);
            res.body.should.have.property('canvasId');
            done()
          })
        })
      });

      it('it should not create a new canvas if the user is not created', (done) => {
        let user = new User({email: 'd@a.com', userName: 'd', password: 'test', token: 1234567})        
        chai.request(server)
        .post('/api/canvas')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object');
          res.body.should.have.property('success');
          res.body.should.have.property('success').eql(false);            
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql('The user doesnt exist');
          done()
        })
      })
    })

    describe('/PATCH/:id save image', () => {
      it('it should save a image on the canvas', (done) => {
        let canvas = new Canvas();
        canvas.name = "My new Canvas";
        canvas.users.push(123);
        canvas.save((err, canvas) => {
          let image = {
            image: 'https://www.google.com.co/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
          };
          chai.request(server)
          .patch(`/api/canvas/${canvas.id}`)
          .send(image)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('success').eql(true);            
            res.body.should.have.property('message')          
            res.body.should.have.property('message').eql('Image saved');                                
            done()
          })
        })
      })
    })
  })
})