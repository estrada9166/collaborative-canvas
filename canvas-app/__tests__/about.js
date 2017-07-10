import React from 'react';
import About from '../src/components/About';
import store from '../src/store';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import renderer from 'react-test-renderer';
import { render } from 'enzyme'

// test('renders without crashing', () => {
//   const component = renderer.create(
//     <Provider store={store}>
//       <MuiThemeProvider>
//         <About />
//       </MuiThemeProvider>
//     </Provider>
//   )

//   let tree = component.toJSON();
//   expect(tree).toMatchSnapshot();
// })

it('renders without crashing', () => {
  render(
    <Provider store={store}>
      <MuiThemeProvider>
        <About />
      </MuiThemeProvider>
    </Provider>
  )
})
