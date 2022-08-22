import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../../utils/axios';
import { persistData } from '../../../utils/persistState';

const NAME = 'AUT/login/login';
export const URL = '/api/login/password';

const apiResponse = {
  "claims_token": {
      "value": "e7e8967f-bb95-424a-b839-399a33691c3a",
      "exp": 1576827403000
  },
  "refresh_token": "e7e8967f-bb95-424a-b839-399a33691c3a"
};

const ERROR_CODES = [
  30001, // incorrect username/password
  30002, // incorrect username/password
];

export const login = createAsyncThunk(
  NAME,
  async ({ data: userData, onSuccess = () => null, onError = () => null }, { dispatch, rejectWithValue }) => {
    try {
      // const headers = { ... };
      // const response = await axios({ ... });
      const response = {
        status: 200,
        data: apiResponse
      };

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

          onSuccess(response.data);
          
          return response.data;
        } else if (ERROR_CODES.includes(response?.data?.details?.errcode)) {
          const errMessage = 'You\'ve entered an incorrect username or password. Please try again';
          onError(response?.data?.details || errMessage);
          return rejectWithValue(response?.data?.details || errMessage);
        } else {
          const errMessage = response?.data?.status?.description || `Request failed with status code ${response?.data?.status?.code}`;
          onError(errMessage);
          return rejectWithValue(errMessage)
        }
      } else {
        const errMessage = 'Login - Response doesn\'t return data';
        onError(errMessage);
        return rejectWithValue(errMessage)
      }
    } catch (err) {
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
