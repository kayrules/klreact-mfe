import React from 'react';
import { Typography, Container, Grid, Box, Button, makeStyles } from '@klreact-mfe/mfe-ui';
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
        <Box sx={styles.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Lifestyles
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Component showcase
            </Typography>
            <Box sx={styles.heroButtons}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Link to="/lifestyle/explore">
                    <Button variant="contained" color="primary">
                      Explore
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/lifestyle/carousel">
                    <Button variant="contained" color="primary">
                      Carousel
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/lifestyle/promo">
                    <Button variant="contained" color="primary">
                      Promo
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/lifestyle/redux">
                    <Button variant="contained" color="primary">
                      Redux Test
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/auth">
                    <Button variant="outline" color="primary">
                      Login Demo
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </main>
    </React.Fragment>
  );
}
