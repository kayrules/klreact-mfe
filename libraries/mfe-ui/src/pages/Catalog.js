import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import MuiTypography from "@mui/material/Typography";
import MuiContainer from "@mui/material/Container";
import MuiPaper from "@mui/material/Paper";
import MuiBox from "@mui/material/Box";
import { Button } from "../components/Button";
import { NervCarousel } from "../components/NervCarousel";

const HeroDiv = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(8, 0, 6),
}));

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
    slidesToSlide: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
    customButtonGroup: null,
  },
};

export default function () {

  return (
    <React.Fragment>
      <HeroDiv>
        <MuiContainer maxWidth="sm">
          <MuiTypography
            variant="h2"
            align="center"
            sx={{ fontFamily: "Lato", fontWeight: "bold" }}
          >
            MFE-UI Catalog
          </MuiTypography>
        </MuiContainer>
      </HeroDiv>
      <MuiContainer maxWidth="md">
        <MuiTypography variant="h5">MFE-UI - Button</MuiTypography>
        <MuiPaper variant="outlined">
          <MuiBox sx={{ padding: "20px" }}>
            <Button>Default button</Button>
            <br />
            <br />
            <Button variant="contained">Contained button</Button>
            <br />
            <br />
            <Button variant="outlined">Outlined button</Button>
          </MuiBox>
        </MuiPaper>

        <br />

        <MuiTypography variant="h5">MFE-UI - Box</MuiTypography>
        <MuiPaper variant="outlined">
          <MuiBox sx={{ padding: '20px' }}>
            this is a box
          </MuiBox>
        </MuiPaper>

        <br />

        <MuiTypography variant="h5">MFE-UI - Responsive Carousel</MuiTypography>
        <MuiPaper variant="outlined" style={{ padding: 10 }}>
          <div style={{ position: "relative" }}>
            <NervCarousel
              responsive={responsive}
              containerClass="carousel-container"
              // ssr={true}
              arrows={false}
            >
              <div style={{ padding: 5 }}>
                <img
                  draggable="false"
                  src="https://assets.imgix.net/unsplash/pineneedles.jpg?w=291&h=262&crop=center&fit=crop"
                  style={{ borderRadius: 9, width: "100%" }}
                />
              </div>
              <div style={{ padding: 5 }}>
                <img
                  draggable="false"
                  src="https://assets.imgix.net/unsplash/mountains.jpg?w=291&h=262&crop=center&fit=crop"
                  style={{ borderRadius: 9, width: "100%" }}
                />
              </div>
              <div style={{ padding: 5 }}>
                <img
                  draggable="false"
                  src="https://assets.imgix.net/unsplash/umbrella.jpg?w=291&h=262&crop=center&fit=crop"
                  style={{ borderRadius: 9, width: "100%" }}
                />
              </div>
              <div style={{ padding: 5 }}>
                <img
                  draggable="false"
                  src="https://assets.imgix.net/unsplash/raspberries.jpg?w=291&h=262&crop=center&fit=crop"
                  style={{ borderRadius: 9, width: "100%" }}
                />
              </div>
              <div style={{ padding: 5 }}>
                <img
                  draggable="false"
                  src="https://assets.imgix.net/unsplash/vintagecameras.jpg?w=291&h=262&crop=center&fit=crop"
                  style={{ borderRadius: 9, width: "100%" }}
                />
              </div>
            </NervCarousel>
          </div>
        </MuiPaper>

      </MuiContainer>
    </React.Fragment>
  );
}
