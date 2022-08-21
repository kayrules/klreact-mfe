import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';
import axios from '../../../utils/axios';
import { isMicro } from '../../../utils/micro';
import { retrieveData, persistData } from '../../../utils/persistState';
import {
  encode_deviceprint,
  getGeolocationStruct,
  DomDataCollection,
  UIEventCollector
} from '../../../utils/rsa';
import { preAuthentication } from '../preLogin/preAuthentication'

const NAME = 'AUT/login/login';
export const URL = '/authService/100000002/login?provider=DcpHsm';

// env file
const appKey = process.env.APP_KEY;
const appSecret = process.env.APP_SECRET;

const ERROR_CODES = [
  30001, // incorrect username/password
  30002, // incorrect username/password
];

export const login = createAsyncThunk(
  NAME,
  async ({ data: userData, onSuccess = () => null, onError = () => null }, { dispatch, rejectWithValue }) => {
    const deviceTokenCookie = retrieveData('deviceTokenCookie');
    try {
      const headers = {
        'X-Kony-App-Key': appKey,
        'X-Kony-App-Secret': appSecret,
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      const loginData = {
        ...userData,
        sourceChannel: 'DIB',
        operationName: 'Login',
        DeviceId: retrieveData('DeviceId'),
        devicePrint: encode_deviceprint(),
        geoLocation: getGeolocationStruct(),
        domElements: DomDataCollection().domDataAsJSON(),
        jsEvents: UIEventCollector.serialize(),
        httpAccept: 'application/json, text/plain, */*',
        httpAcceptEncoding: 'gzip, deflate, br',
        httpAcceptLanguage: 'en-US,en;q=0.9',
        httpReferrer: window.location.href,
        userAgent: navigator.userAgent,
        httpAcceptChars: 'utf-8, iso-8859-1;q=0.5, *;q=0.'
      };

      if (deviceTokenCookie) {
        loginData.deviceTokenCookie = deviceTokenCookie;
      }

      const data = Object.keys(loginData)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(loginData[k])}`)
        .join('&');

      const response = await axios({
        url: URL,
        headers,
        data,
        validateStatus: () => true,
      });

      if (response && response?.data) {
        if (response.status === 200) {
          const claimsToken = response.data.claims_token || null;
          if (claimsToken) {
            persistData('x-token', claimsToken.value);
            persistData('x-expiry', claimsToken.exp);
          }

          const refreshToken = response.data.refresh_token || null;
          if (refreshToken) {
            persistData('r-token', refreshToken);
          }

          const responseDeviceTokenCookie = response.data.provider_token?.params?.user_attributes?.aaop?.deviceTokenCookie || null;
          if (responseDeviceTokenCookie) {
            persistData('deviceTokenCookie', responseDeviceTokenCookie);
          }

          // TODO - add flag to localstore
          // yield put(
          //   setIsFirstTimeLogin(
          //     get(response, 'data.provider_token.user_attributes.newDeviceLogin')
          //   )
          // );

          onSuccess(response.data);
          return response.data;
        } else if (ERROR_CODES.includes(response?.data?.details?.errcode)) {
          const errMessage = 'You\'ve entered an incorrect username or password. Please try again';
          if (isMicro()) {
            alert(response?.data?.details?.errmsg || errMessage);
          }
          onError(response?.data?.details || errMessage);
          return rejectWithValue(response?.data?.details || errMessage);
        } else {
          const errMessage = response?.data?.status?.description || `Request failed with status code ${response?.data?.status?.code}`;
          if (isMicro()) {
            alert(errMessage);
          }
          onError(errMessage);
          return rejectWithValue(errMessage)
        }
      } else {
        const errMessage = 'Response doesn\'t return data';
        if (isMicro()) {
          alert(errMessage);
        }
        onError(errMessage);
        return rejectWithValue(errMessage)
      }
    } catch (err) {
      if (isMicro()) {
        alert(err.message);
      }
      onError(errMessage);
      return rejectWithValue(err.message)
    }
  }
)

export const loginSlice = createSlice({
  name: NAME,
  initialState: {
    loading: false,
    data: null,
    error: null,
    failedCount: 0,
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.loading = true
      state.data = null
      state.error = null
    },
    [login.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.data = payload
      state.error = null
      state.failedCount = 0
    },
    [login.rejected]: (state, { payload }) => {
      state.loading = false
      state.data = null
      state.error = payload
      state.failedCount = state.failedCount + 1
    },
  },
})

export default loginSlice.reducer
