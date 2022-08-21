import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getPosts = createAsyncThunk(
  'LIF/getPosts',
  async (post, { rejectWithValue }) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json()
      return data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const counterSlice = createSlice({
  name: 'LIF/counter',
  initialState: {
    value: 0,
    loading: false,
    posts: [],
    error: null,
  },
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  },
  extraReducers: {
    [getPosts.pending]: (state) => {
      state.loading = true
      state.posts = []
      state.error = null
    },
    [getPosts.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.posts = payload
    },
    [getPosts.rejected]: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer

/* How to select/dispatch in a component.js,

  import { useSelector, useDispatch } from 'react-redux'
  import { increment, decrement } from '../redux/slices/counter'

  ...
  const dispatch = useDispatch()
  const value = useSelector(state => state.LIF.counter.value)
  ...
  onClick={() => dispatch(increment())}
  onClick={() => dispatch(decrement())}
  ...
*/

/* How to dispatch in component.js from a peer package,

  **Note: in order to call an action from outside this package,
  (ONLY when container is running), caller needs to know the TYPE.

  onClick={() => dispatch({
    type: "LIF/counter/increment"
  })}
*/
