import React, {Component} from 'react';
import { Redirect, Route } from 'react-router';

class PrivateRoute extends Component {
  constructor(props){
    super(props)
    this.logged = false;
    if(localStorage.length > 0){
      const sessionInfo = JSON.parse(localStorage.logged);
      this.logged = sessionInfo.logged;
    }
  }

  render() {
    return (
      <div>
        {this.logged? <Route path={this.props.path} component={this.props.component} /> : <Redirect to="/" />}
      </div>
    )
  }
}

export default PrivateRoute;