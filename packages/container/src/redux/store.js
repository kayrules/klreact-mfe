import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import { reducer as lifestyleReducer } from "lifestyle/redux/store"
import { reducer as authReducer } from "auth/redux"

export const reducer = {
  ...authReducer,
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
