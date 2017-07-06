const { 
  findUserByEmail, 
  findUserByUsername, 
  findUserByToken,
  createUser, 
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

const postImage = (req, res) => {
  findCanvasById(req.body, (err, canvas) => {
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

module.exports = { postNewUser, postImage }