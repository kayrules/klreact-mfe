import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import uuid from 'uuid';
import axios from '../../../utils/axios';
import { persistData } from '../../../utils/persistState';

const NAME = 'AUT/preLogin/preAuthentication';
const URL = '/api/Pre-Authentication';

const apiResponse = {
  "data": {
    "access_token": "2181da79-4713-484d-bbca-4f4225b346de",
  },
  "status": {
    "code": "10002",
  }
};

export const preAuthentication = createAsyncThunk(
  NAME,
  async (args, { dispatch, rejectWithValue }) => {
    try {
      // const headers = { ... };
      // const response = await axios({ ... });
      const response = {
        status: 200,
        data: apiResponse
      };

      if (response && response?.data && response?.status === 200) {
        persistData('Prelogin', response.data);
      } else {
        return rejectWithValue('Preauth - Response doesn\'t return data')
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
