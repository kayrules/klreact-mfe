import { combineReducers } from '@reduxjs/toolkit'
import getSecretPhraseReducer from './getSecretPhrase'
import preAuthenticationReducer from './preAuthentication'

export default combineReducers({
  getSecretPhrase: getSecretPhraseReducer,
  preAuthentication: preAuthenticationReducer
});
