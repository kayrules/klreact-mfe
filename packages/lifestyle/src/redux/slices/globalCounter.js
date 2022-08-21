import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'LIF/globalCounter',
  initialState: {
    value: 0
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
  }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer

/* How to select/dispatch in a component.js,

  import { useSelector, useDispatch } from 'react-redux'
  import { increment, decrement } from '../redux/slices/globalCounter'

  ...
  const dispatch = useDispatch()
  const value = useSelector(state => state.LIF.globalCounter.value)
  ...
  onClick={() => dispatch(increment())}
  onClick={() => dispatch(decrement())}
  ...
*/

/* How to dispatch in component.js from a peer package,

  **Note: in order to call an action from outside this package,
  (ONLY when container is running), caller needs to know the TYPE.

  onClick={() => dispatch({
    type: "LIF/globalCounter/increment"
  })}
*/
