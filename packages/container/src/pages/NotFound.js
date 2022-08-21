import React from 'react';
import { Button, Grid, Container, Typography } from '@klreact-mfe/mfe-ui';
import { Link } from 'react-router-dom';

export default function Album() {
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

  return (
    <React.Fragment>
      <main>
        {/* Hero unit */}
        <div className={styles.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              404
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Page Not Found
            </Typography>
            <div className={styles.heroButtons}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Link to="/">
                    <Button variant="contained" color="primary">
                      Home
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
