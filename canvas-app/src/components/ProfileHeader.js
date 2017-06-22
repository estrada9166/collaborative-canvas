import React, {Component} from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

class ProfileHeader extends Component {
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
        </Row>
      </div>
    )
  }
}

const mapDispatchToProps = {

}

export default connect(null, mapDispatchToProps)(ProfileHeader);