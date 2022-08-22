import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
// import Loadable from 'react-loadable';
import { reducer as lifestyleReducer } from "lifestyle/redux/store"

export const reducer = {
  ...lifestyleReducer,
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
