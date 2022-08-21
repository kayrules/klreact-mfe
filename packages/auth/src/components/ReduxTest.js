import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import {
  Button,
  Typography,
  Container
} from '@klreact-mfe/mfe-ui';
import { increment, decrement } from '../redux/slices/counter'
import { init } from '../redux/slices/login/init'

export default function() {
  const dispatch = useDispatch()
  const count = useSelector(state => state.AUT.counter.value)
  const globalCount = useSelector(state => state.LIF?.globalCounter.value || 0)

  useEffect(() => {
    dispatch(init())
  }, []);

  return (
    <React.Fragment>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        AUTH APP
      </Typography>
      <Container maxWidth="sm" component="main">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          auth Counter {count} GlobalCounter {globalCount}
        </Typography>
      </Container>
      <Container maxWidth="md">
        <Button color="primary" onClick={() => dispatch(decrement())}>
          Decrement Local
        </Button>
        <Button color="primary" onClick={() => dispatch(increment())}>
          Increment Local
        </Button>
        <Button color="primary" onClick={() => dispatch({
          type: "LIF/globalCounter/decrement"
        })}>
          Decrement Global
        </Button>
        <Button color="primary" onClick={() => dispatch({
          type: "LIF/globalCounter/increment"
        })}>
          Increment Global
        </Button>
      </Container>
    </React.Fragment>
  );
}
