import React from 'react';
import { Typography, Grid, Box, Link, breakpoints, Container } from '@klreact-mfe/mfe-ui';

const footers = [
  {
    title: 'Company',
    description: ['Team', 'History', 'Contact us', 'Locations'],
  },
  {
    title: 'Features',
    description: [
      'Cool stuff',
      'Random feature',
      'Team feature',
      'Developer stuff',
      'Another one',
    ],
  },
  {
    title: 'Resources',
    description: [
      'Resource',
      'Resource name',
      'Another resource',
      'Final resource',
    ],
  },
  {
    title: 'Legal',
    description: ['Privacy policy', 'Terms of use'],
  },
];

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://innovation.xyz/">
        Innovation
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box sx={{ ...styles.footerBox, ...styles.footerMargin}}>
      <Container variant="footer">
        <Grid container spacing={4} justifyContent="space-evenly">
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={footer.title}>
              <Typography variant="h6" color="textWhite" gutterBottom>
                {footer.title}
              </Typography>
              <ul>
                {footer.description.map((item) => (
                  <li key={item}>
                    <Link href="#" variant="subtitle1" sx={styles.link}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Box mt={5} sx={styles.copyrightBox}>
        <Copyright />
      </Box>
    </Box>
  );
}


const styles = {
  footerBox: {
    backgroundColor: "#333",
    color: "white",
  },
  footerMargin: {
    [breakpoints.up('md')]: {
      marginTop: "50px",
    },
    [breakpoints.down('md')]: {
      marginTop: "200px",
    },
    [breakpoints.down('sm')]: {
      marginTop: "200px",
    },
  },
  link: {
    color: "white",
  },
  linkGrid: {
    margin: "10px"
  },
  copyrightBox: {
    backgroundColor: "#6b8e02",
    height: "60px",
    paddingTop: "20px",
  }
}
