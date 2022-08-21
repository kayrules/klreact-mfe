import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import uuid from 'uuid';
import axios from '../../../utils/axios';
import { persistData, retrieveData } from '../../../utils/persistState';

const NAME = 'AUT/preLogin/getSecretPhrase';
const URL = '/services/PreloginService/GetSecretPhrase';

const SUCCESS_CODES = [
  '10000'
];

// used for special errors later
// const ERROR_CODES = [
//   '38001',
//   '38002'
// ];

export const getSecretPhrase = createAsyncThunk(
  NAME,
  async (args, { dispatch, rejectWithValue }) => {
    const { username } = args;

    try {
      const response = await axios({
        url: URL,
        data: {
          request: {
            username
          }
        },
      });

      if (response && response?.data && response?.status === 200) {
        if (SUCCESS_CODES.includes(response?.data?.status?.code)) {
          return response.data?.data;
        } else {
          // TODO: handle ERROR_CODES
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

export const getSecretPhraseSlice = createSlice({
  name: NAME,
  initialState: {
    loading: false,
    data: null,
    error: null,
    failedCount: 0,
  },
  extraReducers: {
    [getSecretPhrase.pending]: (state) => {
      state.loading = true
      state.data = null
      state.error = null
    },
    [getSecretPhrase.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.data = payload
      state.error = null
      state.failedCount = 0
    },
    [getSecretPhrase.rejected]: (state, { payload }) => {
      state.loading = false
      state.data = null
      state.error = payload
      state.failedCount = state.failedCount + 1
    },
  },
})

export default getSecretPhraseSlice.reducer
