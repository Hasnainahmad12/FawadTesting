// src/store.js

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // Import redux-thunk middleware
import authReducer from './reducers/authReducer'; // Update with the correct path

const rootReducer = combineReducers({
  auth: authReducer,
  // Other reducers here
});

// Apply redux-thunk middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
