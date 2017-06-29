import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import LogModal from './LogModal';
import '../styles/header.css';
import {openLogModal, openSignModal} from '../actionCreators/modalStatus'
import CreateAccountModal from './CreateAccountModal'

class Header extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showModal: false
    };

    this.openLogModal = this.openLogModal.bind(this);
    this.openSignModal = this.openSignModal.bind(this);
  }

  openLogModal() {
    this.props.openLogModal();
  }

  openSignModal() {
    this.props.openSignModal();
  }

  render() {
    return (
      <div className="headerContainer">
        <Row>
          <Col lg={12} md={12} sm={12} xs={12} className="headerDecoration"></Col>
        </Row>
        <Row className="headerMain">
          <Col lg={1} md={2} xs={2} lgOffset={1} >
            <img src="https://s3.amazonaws.com/triptellers/white+board+logo.png" alt="logo" className="imageSize"/>
          </Col>
          <Col lg={2} md={2} xs={2} className="headerName">
            <h3>White Board</h3>
          </Col>
          <Col lg={3} lgOffset={5} className="headerLog">
            <Row>
              <Col lg={3}>
                <Button onClick={this.openLogModal} bsStyle="primary">Log In</Button>
              </Col>
              <Col lg={5}>
                <Button onClick={this.openSignModal} className="signUpButton">Create account</Button>
              </Col>
            </Row>
            <LogModal />
            <CreateAccountModal />
          </Col>
        </Row>
      </div>
    )
  }
}

const mapDispatchToProps = {
  openLogModal: () => openLogModal(),
  openSignModal: () => openSignModal()
}

export default connect(null, mapDispatchToProps)(Header);