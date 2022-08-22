import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import axios from '../../../utils/axios';

const NAME = 'AUT/preLogin/getSecretPhrase';
const URL = '/api/Get-Secret-Phrase';

const apiResponse = {
  "data": {
    "secretPhrase": "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"
  },
  "status": {
    "code": "10000"
  }
}

const SUCCESS_CODES = [
  '10000'
];

export const getSecretPhrase = createAsyncThunk(
  NAME,
  async (args, { dispatch, rejectWithValue }) => {
    const { username } = args;

    try {
      // const response = await axios({ ... });
      const response = {
        status: 200,
        data: apiResponse
      };

      if (response && response?.data && response?.status === 200) {
        if (SUCCESS_CODES.includes(response?.data?.status?.code)) {
          return response.data?.data;
        } else {
          // TODO: handle ERROR_CODES
          return rejectWithValue('Request failed')
        }
      } else {
        return rejectWithValue('secretphrase - Response doesn\'t return data')
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
