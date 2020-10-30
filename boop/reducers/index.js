import { combineReducers } from 'redux';
import boopReducer from './boops';
import friendReducer from './friends';
import userReducer from './user';

export default combineReducers({
  boops: boopReducer,
  friends: friendReducer,
  user: userReducer
});