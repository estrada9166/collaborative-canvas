import React from 'react';
import { shallow } from 'enzyme';
import Canvas from '../src/components/Canvas';

it('it render canvas without problem', () => {
  shallow(<Canvas />)
})