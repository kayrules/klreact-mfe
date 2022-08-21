import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import counterReducer from './slices/counter'
import globalCounterReducer from './slices/globalCounter'

const rootReducer = combineReducers({
  globalCounter: globalCounterReducer,
  counter: counterReducer
});

export const reducer = {
  LIF: rootReducer
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
