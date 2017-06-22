import React, { Component } from 'react';
import { Col, Row, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import {closeSignModal, openLogModal} from '../actionCreators/modalStatus';
import {createAccount} from '../actionCreators/sign';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { Redirect } from 'react-router';

class SignUpModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      userName: null,
      password: null,
      loggedIn: false,
      url: null
    };

    this.close = this.close.bind(this);
    this.openLogModal = this.openLogModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  close() {
    this.props.close()
  }

  openLogModal() {
    this.props.close()
    this.props.openLogModal();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  handleSubmit(){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValidator = re.test(this.state.email)

    if(emailValidator && this.state.userName && this.state.password){
       this.props.createAccount(this.state)
       .then((logResponse) => {
         console.log(logResponse)
          if(logResponse.data.success){
            const loggedObj = {
              userName: logResponse.data.user.userName,
              token: logResponse.data.user.token,
              logged: logResponse.data.success
            }

            localStorage.setItem('logged', JSON.stringify(loggedObj))
            this.setState({
              loggedIn: true,
              url: logResponse.data.canvasId
            })
            this.props.close()
          }
       })
    }
    
  }

  render() {
    const { openStatus } = this.props
    return(
      <div>
        <Modal show={openStatus} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>Create account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col lg={7} lgOffset={3}>
                  <TextField
                    name="email"
                    hintText="Email"
                    floatingLabelText="Email"
                    type="email"
                    onChange={this.handleInputChange}
                  /> 
                  <br />
                  <TextField
                    name="userName"                  
                    hintText="Username"
                    floatingLabelText="UserName"
                    onChange={this.handleInputChange}
                  />
                  <br />
                  <TextField
                    name="password"                  
                    hintText="Password"
                    floatingLabelText="Password"
                    type="password"
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={4} lgOffset={5}>
                  <RaisedButton label="Sign up" primary={true} onClick={this.handleSubmit}/>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.openLogModal} bsStyle="primary">Log In</Button>
              <Button onClick={this.close}>Close</Button>
              {this.state.loggedIn? <Redirect to={`/profile/canvas/${this.state.url}`} /> : null}
            </Modal.Footer>
          </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    openStatus: state.signUpModalReducer.open
  }
}

const mapDispatchToProps =  {
  close: () => closeSignModal(),
  openLogModal: () => openLogModal(),
  createAccount: (userInfo) => createAccount(userInfo)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpModal);