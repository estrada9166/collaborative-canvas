import React, {Component} from 'react';
import { Col, Row } from 'react-bootstrap';

import Header from './Header'
import About from './About'
import Canvas from './Canvas';


class Home extends Component {

  render() {
    return (
      <div>
        <Row>
          <Header />
        </Row>
        <Row className="aboutContainer">
          <About />
        </Row>
        <Row className="canvasContainer">
          <Col lg={12}>
            <Canvas></Canvas>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Home;
