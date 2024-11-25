// rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import packageReducer from './packageReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  package: packageReducer,
  // Add other reducers as needed
});

export default rootReducer;
