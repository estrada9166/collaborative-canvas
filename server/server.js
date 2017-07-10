var express     = require('express')
var app         = express();
var server        = require('http').createServer(app);
var io          = require('socket.io').listen(server);
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
  getAllUserCanvas,
  getCanvasById,
  postNewCanvas,
  patchImage,
  authenticateUser
} = require('./routes/serverMethods')

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

apiRoutes.patch('/authenticate', authenticateUser)

apiRoutes.post('/user', postNewUser);

apiRoutes.get('/canvas', getAllUserCanvas);

apiRoutes.get('/canvas/:id', getCanvasById);

apiRoutes.post('/canvas', postNewCanvas);

apiRoutes.patch('/canvas/:id', patchImage);

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

io.on('connection', (socket) => {
  socket.on('drawing', (coordinates) => {
    io.emit('drawing', coordinates)
  })
});

server.listen(port, function() {
  console.log(`listening to port ${port}`)
});

module.exports = app;