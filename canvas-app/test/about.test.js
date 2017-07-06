import React from 'react';
import About from '../src/components/About';
import store from '../src/store';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import renderer from 'react-test-renderer';

test('hola', () => {
  const component = renderer.create(
    <Provider store={store}>
      <MuiThemeProvider>
        <About />
      </MuiThemeProvider>
    </Provider>
  )

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  console.log(tree.children)
})