import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import '../styles/canvas.css';

class Canvas extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      color: 'black',
      x: null,
      y: null,
      drawing: false,
      context: null,
      width: 790,
      height: 500
    }
    
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.throttle = this.throttle.bind(this);
    this.clear = this.clear.bind(this);
    this.changeColor = this.changeColor.bind(this);
  }
  
  handleOnMouseDown(e){
    this.setState({
      x: e.clientX,
      y: e.clientY,
      drawing: true,
      context: e.target.getContext('2d')
    })
  }

  handleMouseUp(e){
    if(this.state.drawing === false){
      return;
    }
    this.setState({
      drawing: false
    });
    this.drawLine(this.state.x, this.state.y, e.clientX, e.clientY)
    
  }

  handleMouseMove(e){
    if(this.state.drawing === false){
      return;
    }
    this.drawLine(this.state.x, this.state.y, e.clientX, e.clientY);
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

  drawLine(x0, y0, x1, y1){
    const canvasPosition = this.state.context.canvas.getBoundingClientRect()
    const canvasPositionLeft = canvasPosition.left;
    const canvasPositionTop = canvasPosition.top;

    if(this.state.context){
      const context = this.state.context
      context.beginPath();
      context.strokeStyle = this.state.color;      
      context.moveTo(x0 - canvasPositionLeft, y0 - canvasPositionTop);
      context.lineTo(x1 - canvasPositionLeft, y1 - canvasPositionTop);
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

  render() {
    return (
      <div>
        <Row>
          <Col lg={3} lgOffset={3}>
            <Button bsStyle="danger" onClick={this.clear}>Clear</Button>
          </Col>
          <Col lg={4}>
            <Button onClick={() => this.changeColor('orange')} className="orangeColor"></Button>
            <Button onClick={() => this.changeColor('green')} className="greenColor"></Button>
            <Button onClick={() => this.changeColor('red')} className="redColor"></Button>
            <Button onClick={() => this.changeColor('black')} className="blackColor"></Button>                            
          </Col>
        </Row>
        <Row>
          <Col lg={7} lgOffset={3}>
            <canvas 
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

export default Canvas;