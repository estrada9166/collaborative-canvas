import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import '../styles/canvas.css';
import SocketIOClient from 'socket.io-client';
import { saveCanvasAsImg, getCanvasInfo } from '../actionCreators/canvas'

class ProfileCanvas extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      color: 'black',
      x: null,
      y: null,
      drawing: false,
      context: null,
      width: 790,
      height: 500,
      id: props.match.params.id
      //startTimer: false
    }

    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.throttle = this.throttle.bind(this);
    this.clear = this.clear.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.saveImage = this.saveImage.bind(this);

    this.socket = SocketIOClient('http://localhost:8080');    
    this.socket.on('drawing', (coordinates)=>{
      this.drawLineOn(coordinates.x0, coordinates.y0, coordinates.x1, coordinates.y1, coordinates.color)
    })
  }

  componentDidMount() {
    this.setState({
      context: this.profileCanvas.getContext('2d')
    });

    this.props.getCanvasInfo(this.state.id)
    .then((response)=>{
      const image = new Image();
      image.onload = ()=>{
        this.state.context.drawImage(image, 0, 0);
      };
      image.src = response.data.canvas.image;
    })
    .catch((err)=>{
      console.log(err)
    });
  }
  
  handleOnMouseDown(e){
    // if(this.state.startTimer === false){
    //   this.saveCanvas()
    // }

    this.setState({
      x: e.clientX,
      y: e.clientY,
      drawing: true,
      startTimer: true
    })

  }

  // saveCanvas() {
  //   const canvas = this.state.context.canvas;
  //   const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  //   this.props.saveCanvasAsImg(image, this.state.id);
    
  //   setTimeout(()=>{
  //     this.saveCanvas()
  //   }, 30000)
  // }

  handleMouseUp(e){
    if(this.state.drawing === false){
      return;
    }
    this.setState({
      drawing: false
    });
    this.drawLine(this.state.x, this.state.y, e.clientX, e.clientY, this.state.color)   
  }

  handleMouseMove(e){
    if(this.state.drawing === false){
      return;
    }
    this.drawLine(this.state.x, this.state.y, e.clientX, e.clientY, this.state.color);
    this.setState({
      x: e.clientX,
      y: e.clientY
    })
  }

  handleMouseLeave(e) {
    if(this.state.drawing === true){
      this.handleMouseUp(e);
    }
  }

  drawLine(x0, y0, x1, y1, color){
    const canvasPosition = this.state.context.canvas.getBoundingClientRect()
    const canvasPositionLeft = canvasPosition.left;
    const canvasPositionTop = canvasPosition.top;

    if(this.state.context){
      const context = this.state.context
      context.beginPath();
      context.strokeStyle = color;      
      context.moveTo(x0 - canvasPositionLeft, y0 - canvasPositionTop);
      context.lineTo(x1 - canvasPositionLeft, y1 - canvasPositionTop);
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
    }

    this.socket.emit('drawing', {
      x0: x0 - canvasPositionLeft,
      y0: y0 - canvasPositionTop,
      x1: x1 - canvasPositionLeft,
      y1: y1 - canvasPositionTop,
      color: color
    }) 
  }

  drawLineOn(x0, y0, x1, y1, color){
    if(this.state.context){
      const context = this.state.context
      context.beginPath();
      context.strokeStyle = color;      
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
    } 
  }

  throttle(callback, delay){
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  clear(){
    const context = this.state.context
    const width = this.state.width;
    const height = this.state.height;
    
    context.clearRect(0, 0, width, height);
  }

  changeColor(color){
    this.setState({
      color
    })
  }

  saveImage() {
    const canvas = this.state.context.canvas;
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    this.props.saveCanvasAsImg(image, this.state.id)
  }

  render() {
    return (
      <div>
        <Row>
          <Col lg={3} lgOffset={1}>       
            <Button bsStyle="danger" onClick={this.clear}>Clear</Button>
          </Col>
          <Col lg={4}>
            <Button onClick={() => this.changeColor('orange')} className="orangeColor"></Button>
            <Button onClick={() => this.changeColor('green')} className="greenColor"></Button>
            <Button onClick={() => this.changeColor('red')} className="redColor"></Button>
            <Button onClick={() => this.changeColor('black')} className="blackColor"></Button>                         
          </Col>
          <Col lg={2}>
            <Button bsStyle="info" onClick={this.saveImage}>Save canvas</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <canvas 
              ref={(canvas) => {this.profileCanvas = canvas; }}
              onMouseDown={this.handleOnMouseDown} 
              onMouseMove={this.throttle(this.handleMouseMove, 10)} 
              onMouseUp={this.handleMouseUp} 
              onMouseLeave={this.handleMouseLeave} 
              height={this.state.height} 
              width={this.state.width}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

const mapDispatchToProps = {
  saveCanvasAsImg: (image, id) => saveCanvasAsImg(image, id),
  getCanvasInfo: (id) => getCanvasInfo(id)
}

export default connect(null, mapDispatchToProps)(ProfileCanvas);