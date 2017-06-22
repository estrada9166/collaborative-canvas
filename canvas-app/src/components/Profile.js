import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';

import ProfileList from './ProfileList';
import ProfileCanvas from './ProfileCanvas'
import ProfileHeader from './ProfileHeader';
import SavedCanvas from './SavedCanvas';
import JoinCanvas from './JoinCanvas';


import '../styles/profile.css';

import { Route } from 'react-router-dom';

class Profile extends Component {
  render() {
    return (
      <div>
        <Row>
          <ProfileHeader />
        </Row>
        <Row className="profileBody">
          <Col lg={2} lgOffset={1} className="profileList">
            <ProfileList />
          </Col>
          <Col lg={8} lgOffset={1}>
            <Route path={`${this.props.match.url}/canvas/:id`} component={ProfileCanvas}/>
            <Route exact path={`${this.props.match.url}/saved-canvas`} component={SavedCanvas}/>  
            <Route exact path={`${this.props.match.url}/join-canvas`} component={JoinCanvas}/>                                  
          </Col>
        </Row>        
      </div>
    )
  }
}

export default Profile;