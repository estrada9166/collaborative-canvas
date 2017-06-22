import React, { Component } from 'react';
import './App.css';
import history from './history';


import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute'
import Profile from './components/Profile';

// import react router deps
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <div>
            <Route exact path="/" component={Home} />
            <PrivateRoute path="/profile" component={Profile} />
          </div>          
        </Router>
      </div>
    );
  }
}

export default App;
