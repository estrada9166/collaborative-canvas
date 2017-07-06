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

const {
  postNewUser,
  postImage,
} = require('./routes/serverMethods')

const { 
  findUserByEmail, 
  findUserByUsername, 
  findUserByToken,
  createUser, 
} = require('./routes/userMethods')

const {
  getAllCanvas,
  findCanvasById,
  findCanvasByUsers,
  createCanvas,   
  saveCanvasImage,
} = require('./routes/canvasMethods')

// =======================
// configuration =========
// =======================

var port = process.env.PORT || 8080;
mongoose.connect(config.database);

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

apiRoutes.post('/createUser', (req, res) => {
  postNewUser(req, res)
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
  postImage(req, res);
})

apiRoutes.get('/canvas', function(req, res){
  getAllCanvas((err, canvas) => {
    if (err) throw err;

    res.json(canvas)
  })
})

apiRoutes.get('/canvas/:id', function(req, res){
  findCanvasById(req.params, (err, canvas) => {
    if(err) throw err;

    if(!!canvas) {
      res.json({ 
        canvas,
        success: true, 
      })
    } else {
      res.json({ 
        success: false, 
        message: "The canvas doesnt exist",
      })
    }
  })
})

apiRoutes.get('/user-canvas/:token', function(req, res){
  findUserByToken(req.params, (err, user) => {
    if(err) throw err;

    if(user) {
      findCanvasByUsers(user, 10, (err, canvas) => {
        if(err) throw err;

        if(canvas) {
          res.json({
            canvas,
            success: true,
          })
        } else {
          res.json({
            success: false,
            message: 'The user doesnt have canvas',
          })
        }
      })
    } else {
      res.json({
        success: false,
        message: 'The user doesnt exist'
      })
    }
  })
})

apiRoutes.post('/new-canvas', function(req, res){
  findUserByToken(req.body, (err, user) => {
    if(err) throw err;

    if(user) {
      createCanvas(user._id)
      .then((canvas) => {
        res.json({
          success: true,
          canvasId: canvas._id,
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
    res.json({ message: 'welcome to our api!'});
})

app.use('/api', apiRoutes);

io.on('connection', function(socket){
  socket.on('drawing', function(coordinates){
    io.emit('drawing', coordinates)
  })
});

app.listen(port, function() {
  console.log(`listening to port ${port}`)
});

module.exports = app;