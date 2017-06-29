var express     = require('express')
var app         = express();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bcrypt      = require('bcrypt');


var jwt     = require('jsonwebtoken');
var config  = require('./config');
var User    = require('./models/user');
var Canvas  = require('./models/canvas');

// =======================
// configuration =========
// =======================

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb'} ));
app.use(bodyParser.json({limit: '50mb'}));
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// use morgan to log requests to the console
app.use(morgan('dev'));

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.post('/createUser', function(req, res){
  User.findOne({
    email: req.body.email
  }, function(err, email){
    if(err) throw err;

    if(!email){
      User.findOne({
        userName: req.body.userName
      }, function(err, userName){
        if(err) throw err;

        if(!userName){
          var saltRounds = 10;
          var password = req.body.password;
          var salt = bcrypt.genSaltSync(saltRounds);
          var hash = bcrypt.hashSync(password, salt);

          var newUser = new User()
          newUser.email = req.body.email;
          newUser.userName = req.body.userName;
          newUser.password = hash;

          var token = jwt.sign(newUser, app.get('superSecret'), {
            expiresIn: 1440
          })
          
          newUser.token = token;

          newUser.save(function(err){
            if(err) throw err;
          })
          var newCanvas = new Canvas();
          newCanvas.name = "My new Canvas";
          newCanvas.users.push(newUser._id);

          newCanvas.save(function(err){
            if(err) throw err;

            res.json({
              success: true,
              user: newUser,
              canvasId: newCanvas._id
            })
          })
        } else{
          res.json({ success: false, message: "The username is already in use"})
        }
      })
    } else{
      res.json({ success: false, message: "The email is already in use"})
    }
  })
})

apiRoutes.post('/authenticate', function(req, res){
  User.findOne({
    userName: req.body.emailorusername
  }, function(err, user){
    if(err) throw err;

    if(!user){
      User.findOne({
        email: req.body.emailorusername
      }, function(err, email){     
        if(!email){
          res.json({ success: false, message: 'User or Email not found'});
        } else if(email){
          if(bcrypt.compareSync(req.body.password, email.password)){
            var token = jwt.sign(email, app.get('superSecret'), {
              expiresIn: 1440
            })
            email.token = token;
            email.save(function(err){
              if(err) throw err;
            })
            var newCanvas = new Canvas();
            newCanvas.name = "My new Canvas";
            newCanvas.users.push(email._id);

            newCanvas.save(function(err){
              if(err) throw err;

              res.json({
                success: true,
                user: email,
                canvasId: newCanvas._id
              })
            })
          } else{
            res.json({ success: false, message: 'wrong password'});
          }
        }
      })
    } else if(user){
      if(bcrypt.compareSync(req.body.password, user.password)){
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 1440
        })
        user.token = token;
        user.save(function(err){
          if(err) throw err;
        })
        var newCanvas = new Canvas();
        newCanvas.name = "My new Canvas";
        newCanvas.users.push(user._id);

        newCanvas.save(function(err){
          if(err) throw err;

          res.json({
            success: true,
            user: user,
            canvasId: newCanvas._id
          })
        })

      } else{
        res.json({ success: false, message: 'wrong password'});
      }
    }
  })
})

apiRoutes.post('/save-image', function(req, res){
  Canvas.findOne({
    _id: req.body.id
  }, function(err, canvas){
    if(err) throw err;

    if(canvas){
      canvas.image = req.body.image;
      canvas.save(function(err){
        if(err) throw err;
        res.json({ success: true, message: "Image saved" })
      })
    } else{
      res.json({ success: false, message: "The canvas doesnt exist"})
    }
  })
})

apiRoutes.post('/new-canvas', function(req, res){
  User.findOne({
    token: req.body.token
  }, function(err, user){
    if(err) throw err;

    if(user){
      var newCanvas = new Canvas();
      newCanvas.name = "My new Canvas";
      newCanvas.users.push(user._id);
      newCanvas.save(function(err){
        if(err) throw err;

        res.json({
          success: true,
          canvasId: newCanvas._id
        })
      })
    } else {
      res.json({
          success: false,
          message: 'The user doesnt exist'
        })
    }
  }) 
})

apiRoutes.get('/canvas/:id', function(req, res){
  Canvas.findOne({
    _id: req.params.id
  }, function(err, canvas){
    if(err) throw err;

    if(!canvas){
      res.json({ success: true, canvas: canvas})
    } else{
      res.json({ success: false, message: "The canvas doesnt exist"})
    }
  })
})

apiRoutes.get('/user-canvas/:token', function(req, res){
  User.findOne({
    token: req.params.token
  }, function(err, user){
    if(err) throw err;

    if(user){
      Canvas.find({
        users: user._id
      }).limit(10).exec( function(err, canvas){
        if(err) throw err;

        if(canvas){
          res.json({
            success: true,
            canvas: canvas
          })
        } else{
          res.json({
            success: false,
            message: 'The user doesnt have canvas'
          })
        }
      })
    } else{
      res.json({
        success: false,
        message: 'The user doesnt exist'
      })
    }
  })
})

apiRoutes.get('/find/:id', function(req, res){
  User.findOne({
    token: req.params.id
  }, function(err, canvas){
    if(err) throw err;
    if(canvas){
      res.json({
        success: true,
        canvas: canvas
      })
    }
  })
})


// apiRoutes.use(function(req, res, next){
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   if(token){
//     jwt.verify(token, app.get('superSecret'), function(err, decoded){
//       if(err){
//         return res.json({ success: false, message: 'Failed to authenticate token.'})
//       } else{
//         req.decoded = decoded;
//         next();
//       }
//     })
//   } else{
//     return res.status(403).send({
//       succes: false,
//       message: 'No token provided'
//     })
//   }
// })


apiRoutes.get('/', function(req, res){
    res.json({ message: 'welcome to our api aa!' + port});
})

apiRoutes.get('/users', function(req, res){
  User.find({}, function(err, users){
    res.json(users);
  })
})

app.use('/api', apiRoutes);

io.on('connection', function(socket){
  socket.on('drawing', function(coordinates){
    io.emit('drawing', coordinates)
  })
});

http.listen(port, function() {
  console.log('listening to port 8080')
});