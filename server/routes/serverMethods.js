let bcrypt      = require('bcrypt');

const { 
  findUserByEmail, 
  findUserByUsername, 
  findUserByToken,
  authenticateWithUsername,
  authenticateWithEmail,
  createUser, 
  updateToken,
} = require('./userMethods')

const {
  getAllCanvas,
  findCanvasById,
  findCanvasByUsers,
  createCanvas,   
  saveCanvasImage,
} = require('./canvasMethods')

const postNewUser = (req, res) => {
  findUserByEmail(req.body, (err, email) => {
    if(err) throw err;

    if(!email) {
      findUserByUsername(req.body, (err, userName) => {
        if(err) throw err;

        if(!userName) {
          createUser(req.body, res)
          .then((user) => {
            createCanvas(user._id)
            .then((canvas) => {
              res.json({
                user,
                success: true,
                canvasId: canvas._id,
              })
            })
          })
        } else {
          res.json({ 
            success: false, 
            message: 'The username is already in use',
          })
        }
      })
    } else {
      res.json({ 
        success: false, 
        message: 'The email is already in use',
      })
    }
  })
}

const getAllUserCanvas = (req, res) => {
  findUserByToken(req.query, (err, user) => {
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
};

const getCanvasById = (req, res) => {
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
};

const postNewCanvas = (req, res) => {
  findUserByToken(req.body, (err, user) => {
    if(err) throw err;

    if(user) {
      createCanvas(user.id)
      .then((canvas) => {
        res.json({
          success: true,
          canvasId: canvas.id,
        })
      })
    } else {
      res.json({
        success: false,
        message: 'The user doesnt exist'
      })
    }
  }) 
}

const patchImage = (req, res) => {
  findCanvasById(req.params, (err, canvas) => {
    if(err) throw err;

    if(canvas) {
      canvas.image = req.body.image;
      saveCanvasImage(canvas, req.body)
      .then(() => {
        res.json({ 
          success: true, 
          message: "Image saved",
        }) 
      })
    } else {
      res.json({ 
        success: false, 
        message: "The canvas doesnt exist",
      })
    }
  })
}

const logIn = (userPassword, savedPassword, user, res) => {
  if(bcrypt.compareSync(userPassword, savedPassword)){
    updateToken(user)
    .then((user) => {
      createCanvas(user._id)
      .then((canvas) => {
        res.json({
          user,
          success: true,
          canvasId: canvas._id,
        })
      })
    })
  } else {
    res.json({ success: false, message: 'wrong password'});
  }
}

const authenticateUser = (req, res) => {
  authenticateWithUsername(req.body, (err, user) => {
    if(err) throw err;

    if(!user) {
      authenticateWithEmail(req.body, (err, email) => {
        if(err) throw err;

        if(!email) {
          res.json({ 
            success: false, 
            message: 'User or Email not found',
          });
        } else if(email) {
          logIn(req.body.password, email.password, email, res)
        }
      })
    } else if(user) {
      logIn(req.body.password, user.password, user, res)
    }
  })
} 
module.exports = { postNewUser, getAllUserCanvas, getCanvasById, postNewCanvas, patchImage, authenticateUser }