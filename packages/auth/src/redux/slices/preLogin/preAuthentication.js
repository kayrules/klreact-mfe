import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import uuid from 'uuid';
import axios from '../../../utils/axios';
import { persistData, retrieveData } from '../../../utils/persistState';

const NAME = 'AUT/preLogin/preAuthentication';
const URL = '/services/PreloginService/PreAuthentication';

// 10000? will only increase the failed count?
const SUCCESS_CODES = [
  '10002',
  '10005'
];

export const preAuthentication = createAsyncThunk(
  NAME,
  async (args, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        'X-Kony-API-Version': '1.0',
        'X-Kony-ReportingParams':
          '{"ua":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36","aid":"2dcf5a89-96a6-4387-a583-f42bcad26f05","aname":"DCP 1.0.0","atype":"browser","stype":"b2c","sdkversion":"8.3.0","sdktype":"plain-js","svcid":"PreAuthentication"}'
      };

      const request = encodeURIComponent(JSON.stringify({
        deviceId: retrieveData('DeviceId'),
        versionKey: 'dev-android'
      }));

      const response = await axios({
        url: URL,
        headers,
        data: `request=${request}`
      });

      if (response && response?.data && response?.status === 200) {
        persistData('Prelogin', response.data);

        if (SUCCESS_CODES.includes(response?.data?.status?.code)) {
          return response.data?.data;
        } else {
          return rejectWithValue(response?.data?.status?.description || `Request failed with status code ${response?.data?.status?.code}`)
        }
      } else {
        return rejectWithValue('Response doesn\'t return data')
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const preAuthenticationSlice = createSlice({
  name: NAME,
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  extraReducers: {
    [preAuthentication.pending]: (state) => {
      state.loading = true
      state.data = null
      state.error = null
    },
    [preAuthentication.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.data = payload
      state.error = null
    },
    [preAuthentication.rejected]: (state, { payload }) => {
      state.loading = false
      state.data = null
      state.error = payload
    },
  },
})

export default preAuthenticationSlice.reducer
