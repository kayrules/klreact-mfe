import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';
import axios from '../../../utils/axios';
import { persistData } from '../../../utils/persistState';
import { preAuthentication } from '../preLogin/preAuthentication'

const NAME = 'AUT/login/init';
export const URL = '/authService/100000002/login';

// env file
const appKey = process.env.APP_KEY;
const appSecret = process.env.APP_SECRET;

export const init = createAsyncThunk(
  NAME,
  async (args, { dispatch, rejectWithValue }) => {
    // double check if we should use uuid v3.3.3 instead
    // to standardize with IBK's
    persistData('DeviceId', `DIB-${uuidv4()}`);

    try {
      const headers = {
        'X-Kony-App-Key': appKey,
        'X-Kony-App-Secret': appSecret,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Kony-ReportingParams':
          '{"ua":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36","aid":"2dcf5a89-96a6-4387-a583-f42bcad26f05","aname":"DCP 1.0.0","atype":"browser","stype":"b2c","sdkversion":"8.3.0","sdktype":"plain-js","svcid":"PreAuthentication"}',
        'X-Kony-Platform-Type': 'browser',
        'X-Kony-SDK-Type': 'plain-js',
        'X-Kony-SDK-Version': '8.3.0'
      };

      const response = await axios({
        url: URL,
        headers,
      });

      if (response && response?.data && response?.status === 200) {
        persistData('x-token', response.data.claims_token.value);
        persistData('x-expiry', response.data.claims_token.exp);
        persistData('r-token', response.data.refresh_token);

        return dispatch(preAuthentication())
          .unwrap()
          .catch(err => {
            return rejectWithValue(err)
          });
      } else {
        return rejectWithValue('Response doesn\'t return data')
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const initSlice = createSlice({
  name: NAME,
  initialState: {
    loading: false,
    error: null,
    failedCount: 0,
  },
  extraReducers: {
    [init.pending]: (state) => {
      state.loading = true
      state.error = null
    },
    [init.fulfilled]: (state) => {
      state.loading = false
      state.error = null
      state.failedCount = 0
    },
    [init.rejected]: (state, { payload }) => {
      state.loading = false
      state.error = payload
      state.failedCount = state.failedCount + 1
    },
  },
})

export default initSlice.reducer
