import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import loginReducer from './slices/login'
import preLoginReducer from './slices/preLogin'
import counterReducer from './slices/counter'

const rootReducer = combineReducers({
  login: loginReducer,
  preLogin: preLoginReducer,
  counter: counterReducer
});

export const reducer = {
  AUT: rootReducer
}

const logger = createLogger({
  collapsed: true
});

const getMiddlewares = getDefaultMiddleware => {
  let middlewares = getDefaultMiddleware();

  if (process.env.NODE_ENV !== 'production') {
    middlewares = [
      ...middlewares,
      logger
    ]
  }

  return middlewares;
}

export default configureStore({
  reducer: reducer,
  middleware: getMiddlewares,
  devTools: process.env.NODE_ENV !== 'production',
})
