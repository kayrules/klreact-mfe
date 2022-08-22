import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { persistData } from '../../../utils/persistState';
import { preAuthentication } from '../preLogin/preAuthentication'

const NAME = 'AUT/login/init';
export const URL = '/authService/100000002/login';

const apiResponse = {
  "claims_token": {
    "value": "eyAidHlwIjogImp3dCIsICJhbGciOiAiUlMyNTYiIH0",
    "exp": 1576827403000
  },
  "refresh_token": "eyAiX3ZlciI6ICJ2MS4xIiwgImlzcyI6ICJodHRwczovLzE3Mi4zMC43OS4zMjo4"
};

// env file
const appKey = process.env.APP_KEY;
const appSecret = process.env.APP_SECRET;

export const init = createAsyncThunk(
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
        persistData('x-token', response.data.claims_token.value);
        persistData('x-expiry', response.data.claims_token.exp);
        persistData('r-token', response.data.refresh_token);

        return dispatch(preAuthentication())
          .unwrap()
          .catch(err => {
            return rejectWithValue(err)
          });
      } else {
        return rejectWithValue('Init - Response doesn\'t return data')
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
