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
      chai.request(server)
        .get('/api/canvas')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        })
    });

    describe('/GET canvas by id', () => {
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

    describe('/GET canvas by users', () => {
      it('it should get all the canvas by user', (done) => {
        let user = new User({email: 'a@a.com', userName: 'a', password: 'test', token: 1234})
        user.save((err, user) => {
          let canvas = new Canvas();
          canvas.name = "My new Canvas";
          canvas.users.push(user.id);
          canvas.save((err, canvas) => {
            chai.request(server)
            .get(`/api/user-canvas/${user.token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('object');
              res.body.should.have.property('success');
              res.body.should.have.property('success').eql(true);
              res.body.should.have.property('canvas');
              res.body.canvas.should.be.a('array');                                          
              done()
            })
          })
        })
      })
    })

    describe('/POST save image on canvas', () => {
      it('it should save a image on the canvas', (done) => {
        let canvas = new Canvas();
        canvas.name = "My new Canvas";
        canvas.users.push(123);
        canvas.save((err, canvas) => {
          let image = {
            image: 'https://www.google.com.co/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
            id: canvas.id
          };
          chai.request(server)
          .post('/api/save-image')
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