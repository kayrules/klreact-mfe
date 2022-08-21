import React from 'react';
import { Typography, Container, Grid, Button, makeStyles } from '@klreact-mfe/mfe-ui';
import { Link } from 'react-router-dom';

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
  heroButtons: {
    marginTop: '20px',
  }
};

export default function() {

  return (
    <React.Fragment>
      <main>
        <div sx={styles.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Pre-login
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              This is the landing page
            </Typography>
            <div sx={styles.heroButtons}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Link to="/lifestyle/explore">
                    <Button variant="contained" color="primary">
                      Explore
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/auth">
                    <Button variant="outlined" color="primary">
                      Login
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </main>
    </React.Fragment>
  );
}
