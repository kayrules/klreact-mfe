import React from 'react';
import { Typography, Container, Grid, Button, Box, makeStyles } from '@klreact-mfe/mfe-ui';
import { Link } from 'react-router-dom';
import Login from './Login';

const styles = {
  '@global': {
    a: {
      textDecoration: 'none',
    },
  },
  icon: {
    marginRight: '10px',
  },
  heroContent: {
    backgroundColor: '#fff',
    padding: "8px 0px 6px"
  },
  loginBox: {
    marginTop: '50px',
    backgroundColor: '#efefef',
    padding: '50px',
  }
};

export default function() {

  return (
    <React.Fragment>
      <main>
        <Box sx={styles.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Login Demo
            </Typography>
            <Box sx={styles.loginBox}>
              <Grid container justifyContent="center">
                <Login />
              </Grid>
            </Box>
          </Container>
        </Box>
      </main>
    </React.Fragment>
  );
}
