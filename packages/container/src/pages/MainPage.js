import React, { useRef, useEffect, Suspense } from "react";
import { useDispatch } from 'react-redux'
import Loadable from 'react-loadable';
// import { Login } from "auth/components";
// import { HomeCarousel } from "lifestyle/components";
import { Grid, Box, Container, Typography, breakpoints, MockComponent } from "@klreact-mfe/mfe-ui";
import { getCarouselHeight, getBreakpoint } from "../utils";
// import { globalActions } from "auth/redux";
import Header from '_components/Header';
import Footer from '_components/Footer';

// const { Login } = lazily(() => import("auth/components"));
// const { HomeCarousel } = lazily(() => import("lifestyle/components"));

const Login = Loadable({
  loader: () => import('auth/components').then(c => c.Login),
  loading: () => <MockComponent />
});

const HomeCarousel = Loadable({
  loader: () => import('lifestyle/components').then(c => c.HomeCarousel),
  loading: () => <MockComponent sx={{ height: '300px' }} />
});

const MainPage = () => {
  const dispatch = useDispatch()

  const carouselRef = useRef(null);
  const carouselHeight = getCarouselHeight(carouselRef);

  // useEffect(() => {
  //   dispatch(globalActions.init())
  // }, [])

  const HeroBox = () => (
    <Grid container columns={20} sx={styles.heroBox}>
      <Grid item xs={20} md={20} sx={styles.blueBox} />
    </Grid>
  );

  return (
    <React.Fragment>
      <Header />
      <HeroBox />
      <Container maxWidth="xl" disableGutters sx={styles.content}>
        <Box sx={{ ...styles.loginContainer }}>
          <Box sx={styles.titleBox}>
            <Typography sx={styles.textTitle} fontWeight="fontWeightBold">Innovative Banking</Typography>
          </Box>
          
          {/* <ErrorBoundary errorMessage="Ops.. Auth service down"> */}
            <Login sx={styles.login}>Auth: Login</Login>
          {/* </ErrorBoundary> */}

          <Typography sx={styles.forgotPass}>FORGOT PASSWORD</Typography>
        </Box>
        <div ref={carouselRef} style={{ marginTop: '180px', ...carouselHeight }}>
          <h3>Explore Lifestyle</h3>
          <HomeCarousel bp={getBreakpoint()}>Lifestyle: Carousel</HomeCarousel>
        </div>
      </Container>
      <Footer />
    </React.Fragment>
  );
}

const styles = {
  loginContainer: {
    [breakpoints.up('md')]: {
      width: '46%',
      margin: 'auto',
    },
    [breakpoints.down('md')]: {
      width: '75%',
      marginBottom: '50px',
    },
    [breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: '50px',
    },
  },
  login: {
    marginTop: '10px',
    position: 'relative',
    width: '100%',
  },
  carousel: {
    width: '100%',
  },
  heroBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    [breakpoints.up('md')]: {
      height: '500px',
    },
    [breakpoints.down('md')]: {
      height: '500px',
    },
    [breakpoints.down('sm')]: {
      height: '459px',
    },
    padding: 0,
    margin: 0,
  },
  secondBox: {
    position: "absolute",
    top: '246px',
    left: 0,
    right: 0,
    zIndex: -2,
    height: '532px',
    padding: 0,
    margin: 0,
  },
  blueBox: {
    background: "green url(https://assets.imgix.net/examples/kingfisher.jpg?w=1611&h=500&crop=center&fit=crop) center",
    // background: "green url(https://images6.fanpop.com/image/photos/34500000/Green-Wallpaper-colors-34511120-1920-1200.jpg) center",
    height: "100%",
    display: "inline",
  },
  lightBlueBox: {
    backgroundColor: "#f3fbfe",
    height: "100%",
    display: "inline",
  },
  whiteBox: {
    backgroundColor: "transparent",
    height: "100%",
  },
  content: {
    zIndex: 1,
    width: '90%',
    margin: 'auto',
  },
  textTitle: {
    fontSize: '60px',
    whiteSpace: 'nowrap',
    color: '#fff',
    display: 'block',
    textAlign: 'center',
    verticalAlign: 'top',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: '50px',
    marginTop: '100px',
  },
  titleBox: {
    alignContent: 'flex-start',
    flexDirection: 'row',
    paddingLeft: '20px',
  },
  forgotPass: {
    fontSize: '12px',
    opacity: 0.5,
    fontWeight: 'bold',
    color: '#fff',
    [breakpoints.down('sm')]: {
      textAlign: 'center',
      width: '100%',
    },
    [breakpoints.up('sm')]: {
      paddingLeft: '20px',
    },
    paddingTop: '5px',
  },
  registerBox: {
    marginTop: '16px',
    marginBottom: '20px',
    padding: '10px 20px',
    borderRadius: '8px',
    background: 'linear-gradient(to bottom, #27a4d36b, #ffffff00)',
    height: '80px',
  },
  textConnect: {
    fontSize: '14px',
    color: '#fff',
    lineHeight: 1.43,
  },
  textRegister: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
    [breakpoints.down('sm')]: {
      textAlign: 'center',
      marginTop: '10px',
    }
  },
};

export default MainPage;
