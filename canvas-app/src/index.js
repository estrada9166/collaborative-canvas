import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

//import this to use MATERIAL-UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {deepOrange700} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './index.css';
import { Provider } from 'react-redux';
import store from './store';




//Define the theme color for MATERIAL-UI
const muiTheme = getMuiTheme({
  palette: { 
    primary1Color: deepOrange700,
  }
});

//call this method to solve MATERIAL-UI problem
injectTapEventPlugin();

const MyApp = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <App/>
  </MuiThemeProvider>
)

ReactDOM.render(
  <Provider store={store}>
    <MyApp />
  </Provider>, 
  document.getElementById('root')
);
registerServiceWorker();
