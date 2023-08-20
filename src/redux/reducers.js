import { combineReducers } from 'redux';

const tokenReducer = (state = null, action) => {
  if (action.type === 'SET_TOKEN') {
    return action.payload;
  }
  return state;
};

const rootReducer = combineReducers({
  token: tokenReducer,
});

export default rootReducer;
