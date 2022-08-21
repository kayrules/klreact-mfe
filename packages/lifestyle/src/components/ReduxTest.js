import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import {
  Button,
  Typography,
  Container
} from '@klreact-mfe/mfe-ui';
import { increment, decrement, getPosts } from '../redux/slices/counter'
import { increment as incrementGlobal, decrement as decrementGlobal } from '../redux/slices/globalCounter'

export default function() {
  const dispatch = useDispatch()
  const count = useSelector(state => state.LIF.counter.value)
  const globalCount = useSelector(state => state.LIF.globalCounter.value)
  const posts = useSelector(state => state.LIF.counter.posts)

  useEffect(() => {
    dispatch(getPosts())
  }, [])

  return (
    <React.Fragment>
      <Container maxWidth="sm" component="main">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          LIFESTYLE APP
        </Typography>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          lifestyle Counter {count} GlobalCounter {globalCount}
        </Typography>
      </Container>
      <Container maxWidth="md">
        <Button color="primary" onClick={() => dispatch(decrement())}>
          Decrement Local
        </Button>
        <Button color="primary" onClick={() => dispatch(increment())}>
          Increment Local
        </Button>
        <Button color="primary" onClick={() => dispatch(decrementGlobal())}>
          Decrement Global
        </Button>
        <Button color="primary" onClick={() => dispatch(incrementGlobal())}>
          Increment Global
        </Button>
      </Container>
      <Container maxWidth="md">
        {posts.map(p => (
          <Typography
            color="textPrimary"
          >
            Title: {p.title}
          </Typography>
        ))}
      </Container>
    </React.Fragment>
  );
}
