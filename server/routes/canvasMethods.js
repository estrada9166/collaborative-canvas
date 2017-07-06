let mongoose    = require('mongoose');

//let Canvas  = require('../models/canvas');
let Canvas  = require('../models/canvas_test');

const getAllCanvas = (callback) => {
  Canvas.find({}, (err, canvas) => {
    callback(err, canvas);
  })
};

const findCanvasById = ({id}, callback) => {
  Canvas.findOne({
    _id: id
  }, (err, canvas) => {
    callback(err, canvas);
  })
};

const findCanvasByUsers = ({id}, limit, callback) => {
  Canvas.find({
    users: id
  }).limit(limit).exec((err, canvas) => {
    callback(err, canvas);
  })
};

const createCanvas = (userId) => {
  const newCanvas = new Canvas();
  newCanvas.name = "My new Canvas";
  newCanvas.users.push(userId);

  return newCanvas.save((err, canvas) => {
    if(err) res.send(err);
    return canvas;
  })
};

const saveCanvasImage = (canvas, {image}) => {
  canvas['image'] = image;
  return canvas.save((err, canvas) => {
    if(err) res.send(err);
    return canvas;
  })
};

module.exports = { getAllCanvas, findCanvasById, findCanvasByUsers, createCanvas, saveCanvasImage }
