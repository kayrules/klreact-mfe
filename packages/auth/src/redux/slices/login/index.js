import { combineReducers } from '@reduxjs/toolkit'
import initReducer from './init'
import loginReducer from './login'

export default combineReducers({
  init: initReducer,
  login: loginReducer
});
