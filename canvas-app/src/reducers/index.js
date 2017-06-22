import { combineReducers } from 'redux';

import modalReducer from './modalReducer';
import signUpModalReducer from './signUpModalReducer';
import savedCanvasReducer from './savedCanvasReducer';

const rootReducer = combineReducers({ modalReducer, signUpModalReducer, savedCanvasReducer });

export default rootReducer;