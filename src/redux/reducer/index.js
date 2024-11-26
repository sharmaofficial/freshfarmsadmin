// rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import packageReducer from './packageReducer';
import inventoryReducer from './inventoryReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  package: packageReducer,
  inventory: inventoryReducer,
  // Add other reducers as needed
});

export default rootReducer;
