import React, { useEffect, useState, useRef } from "react";
import { Box, Grid, Typography, ChevronLeft, ChevronRight } from "@klreact-mfe/mfe-ui";
import { getDeviceConfig, includeBp } from "../utils";
import { throttle } from "lodash";
import Alerts from "_components/Alerts";
import Favourites from "_components/Favourites";
import Header from "_components/Header";
import { JustForYou } from "lifestyle/components";

const Dashboard = () => {
  const [leftContainerBoxWidth, setLeftContainerBoxWidth] = useState(0);
  const [currentBP, setCurrentBP] = useState("");
  const [carouselContainerSize, setCarouselContainerSize] = useState(0);
  const [isFirst, setIsFirst] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const cRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [justForYouNumOfItems, setJustForYouNumOfItems] = useState(0);

  useEffect(() => {
    // Check for profile details in redux

    if (currentBP === "") {
      setCurrentBP(getDeviceConfig(window.innerWidth));
    }

    if (carouselContainerSize === 0) {
      setCarouselContainerSize(
        document.querySelector("#carouselContainer").clientWidth
      );
    }

    if (justForYouNumOfItems === 0) {
      calcJustForYouNumOfItems();
    }

    const calcInnerWidth = throttle(function () {
      setCurrentBP(getDeviceConfig(window.innerWidth));
      if (includeBp(["md", "lg", "xl"]))
        setLeftContainerBoxWidth(document.querySelector("#boxy").clientWidth);
      setCarouselContainerSize(
        document.querySelector("#carouselContainer").clientWidth
      );
      calcJustForYouNumOfItems();
    }, 200);
    window.addEventListener("resize", calcInnerWidth);

    return () => {
      window.removeEventListener("resize", calcInnerWidth);
    };

  }, []);

  useEffect(() => {
    if (currentSlide === 0) {
      setIsFirst(true);
    } else {
      setIsFirst(false);
    }

    if (
      currentSlide === cRef.current?.getTotalItems() - 1 ||
      currentSlide === cRef.current?.getTotalItems() - 2
    ) {
      setIsLast(true);
    } else {
      setIsLast(false);
    }
  }, [currentSlide]);

  const calcJustForYouNumOfItems = () => {
    if (includeBp(["xs", "sm"])) {
      setJustForYouNumOfItems(1);
    } else if (includeBp(["md"])) {
      setJustForYouNumOfItems(2);
    } else {
      setJustForYouNumOfItems(3);
    }
  }

  const CustomButtonGroup = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          onClick={() => {
            cRef.current.prev();
            cRef.current.getTotalItems();
          }}
          style={{
            display: "flex",
            width: "30px",
            height: "30px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronLeft sx={{ color: "#0067b1", opacity: isFirst ? 0.5 : 1 }} />
        </div>
        <div
          onClick={() => {
            cRef.current.next();
            cRef.current.getTotalItems();
          }}
          style={{
            marginLeft: "3px",
            display: "flex",
            width: "30px",
            height: "30px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronRight sx={{ color: "#0067b1", opacity: isLast ? 0.5 : 1 }} />
        </div>
      </Box>
    );
  };

  return (
    <React.Fragment>
      <Header />
      {/* This is to cater favourite background */}
      <Box
        sx={{
          display: "block",
          position: "absolute",
          height: "135px",
          backgroundColor: "#F7F9FB",
          left: includeBp(["xs", "sm"]) ? "100px" : "0",
          right: "0",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          ...styles.outerContainer,
          width: "90%",
          position: "relative",
        }}
      >
        <Grid container columns={includeBp(['sm', "md", "lg", "xl"]) ? 14 : 10}>
          {includeBp(['sm', "md", "lg", "xl"]) && (
            <Grid item xs={4}>
              <Box
                id="boxy"
                sx={{
                  position: "relative",
                  backgroundColor: "#f3fbfe",
                  left: 0,
                  right: 0,
                  height: "100%",
                }}
              >
                {includeBp(['sm', "md", "lg", "xl"]) && (
                  <Box
                    sx={{
                      position: "absolute",
                      backgroundColor: "#f3fbfe",
                      right: leftContainerBoxWidth,
                      width: "1000%",
                      height: "100%",
                      zIndex: -1,
                    }}
                  />
                )}
                {/* To find a way to get the header height */}
                <Alerts headerHeight="238" />
              </Box>
            </Grid>
          )}
          <Grid
            item
            xs={10}
            style={{ paddingLeft: !includeBp(['xs']) && "24px", backgroundColor: "#fff" }}
          >
            <Box
              sx={{
                display: "block",
                position: "relative",
                paddingTop: "18px",
                backgroundColor: "#ffffff",
                backgroundImage:
                  "linear-gradient(141deg, rgba(248, 248, 248, 0) 38%, rgba(237, 241, 246, 0.4) 59%)",
                marginBottom: "41px",
                height: "135px",
              }}
            >
              <Favourites />
            </Box>
            <Box
              id="carouselContainer"
              sx={{
                display: "block",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#424b57",
                  }}
                >
                  Accounts
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#0067b1",
                      marginRight: "4px",
                    }}
                  >
                    MORE ACCOUNTS
                  </Typography>
                  <CustomButtonGroup />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "38px",
              }}
              id="asdasd"
            >
              <JustForYou numberOfItems={justForYouNumOfItems} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

const styles = {
  content: {
    zIndex: 1,
    width: "100%",
    margin: "auto",
    padding: 0,
  },
  outerContainer: {
    maxWidth: "1425px",
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Dashboard;
