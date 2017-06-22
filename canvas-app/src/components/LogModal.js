import React, { Component } from 'react';
import { Col, Row, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { closeLogModal , openSignModal} from '../actionCreators/modalStatus'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CreateAccountModal from './CreateAccountModal'
import {signIn} from '../actionCreators/sign'
import { Redirect } from 'react-router';

class LogModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailOrUsername: null,
      password: null,
      loggedIn: false,
      url: null
    };

    this.close = this.close.bind(this);
    this.openSignModal = this.openSignModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  close() {
    this.props.close()
  }

  openSignModal() {
    this.props.close()
    this.props.openSignModal();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  handleSubmit() {
    if(this.state.emailOrUsername && this.state.password){
       this.props.signIn(this.state)
       .then((logResponse) => {
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
              <Modal.Title>Log in</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col lg={7} lgOffset={3}>
                  <TextField
                    name="emailOrUsername"
                    hintText="Email or Username"
                    floatingLabelText="Email or UserName"
                    type="email"
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
                  <RaisedButton label="Log in" primary={true} onClick={this.handleSubmit}/>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.openSignModal} className="signUpButton">Create account</Button>
              <Button onClick={this.close}>Close</Button>
              {this.state.loggedIn? <Redirect to={`/profile/canvas/${this.state.url}`} /> : null}  
            </Modal.Footer>
          </Modal>
          <CreateAccountModal />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    openStatus: state.modalReducer.open
  }
}

const mapDispatchToProps =  {
  close: () => closeLogModal(),
  openSignModal: () => openSignModal(),
  signIn: (userInfo) => signIn(userInfo)
}

export default connect(mapStateToProps, mapDispatchToProps)(LogModal);