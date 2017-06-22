import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getCanvasInfo } from '../actionCreators/canvas';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { Redirect } from 'react-router-dom';


class JoinCanvas extends Component {
  constructor(props){
    super(props)

    this.state = {
      canvasId: null,
      exist: null
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;

    this.setState({
      canvasId: value
    })
  }

  handleSubmit(){
    if(this.state.canvasId){
      this.props.getCanvasInfo(this.state.canvasId)
      .then((response)=>{
        if(response.data.success){
          this.setState({
            exist: true
          })
        } else{
          this.setState({
            exist: false
          })
        }
      })
      .catch((err)=>{
        console.log(err)
      });
    }
  }

  render() {
    return(
      <div className="joinCanvas">
        <Row>
          <Col lg={4} lgOffset={3}>
            <TextField
              hintText="Canvas ID"
              floatingLabelText="Canvas ID"
              onChange={this.handleInputChange}
              errorText={this.state.exist === false? "This ID doesn't exist" : null}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={4} lgOffset={4}>
            <RaisedButton label="Join" primary={true} onClick={this.handleSubmit}/>
          </Col>
        {this.state.exist? <Redirect to={`../canvas/${this.state.canvasId}`} /> : null}  
        </Row>
      </div>
    )
  }
}

const mapDispatchToProps = {
  getCanvasInfo: (id) => getCanvasInfo(id)
}

export default connect(null, mapDispatchToProps)(JoinCanvas);