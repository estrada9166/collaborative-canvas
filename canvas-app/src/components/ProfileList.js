import React, {Component} from 'react';
import { connect } from 'react-redux';
import history from '../history'

import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import CreateCanvas from 'material-ui/svg-icons/content/create';
import JoinCanvas from 'material-ui/svg-icons/social/group';
import LogOut from 'material-ui/svg-icons/navigation/first-page';
import {blue500, yellow600} from 'material-ui/styles/colors';

import '../styles/profile.css';

import { Link } from 'react-router-dom';
import {createNewCanvas} from '../actionCreators/canvas'

class ProfileList extends Component {
  constructor(props) {
    super(props);

    const sessionInfo = JSON.parse(localStorage.logged);
    this.state = {
      firstLetter: sessionInfo.userName? sessionInfo.userName.slice(0,1) : 'N/A',
      userName: sessionInfo.userName
    }
    this.newCanvas = this.newCanvas.bind(this);
    this.logOut = this.logOut.bind(this)
  }

  newCanvas() {
    const data = JSON.parse(localStorage.getItem('logged'))
    this.props.createNewCanvas(data.token)
    .then((response)=>{
      history.push(`/profile/canvas/${response.data.canvasId}`);
      history.go()
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  logOut() {
    localStorage.clear();
  }

  render() {
    return(
      <div>
        <List className="profileFolders">
          <ListItem
            leftAvatar={<Avatar>{this.state.firstLetter}</Avatar>}
            primaryText={this.state.userName}
          />
        </List>
        <List className="profileFolders">
          <ListItem
            leftAvatar={<Avatar icon={<CreateCanvas />} backgroundColor={blue500} />}
            rightIcon={<ActionInfo />}
            primaryText="New Canvas"
            onClick={this.newCanvas}
            >
          </ListItem> 
          <Link to="/profile/join-canvas/"> 
            <ListItem
              leftAvatar={<Avatar icon={<JoinCanvas />} backgroundColor={yellow600} />}
              rightIcon={<ActionInfo />}
              primaryText="Join Canvas"
            />
          </Link>
        </List>
        <List className="profileFolders">
          <Subheader inset={true}>Folders</Subheader>
          <Link to="/profile/saved-canvas/">
            <ListItem
              leftAvatar={<Avatar icon={<FileFolder />} />}
              rightIcon={<ActionInfo />}
              primaryText="Saved Canvas"
            />
          </Link>
        </List>
        <List>
          <Link onClick={this.logOut} to="/">
            <ListItem
              leftAvatar={<Avatar icon={<LogOut />} />}
              primaryText="Log out"
            />
          </Link>
        </List>
      </div>
    )
  }
}

const mapDispatchToProps = {
  createNewCanvas: (token) => createNewCanvas(token)
}


export default connect(null, mapDispatchToProps)(ProfileList);