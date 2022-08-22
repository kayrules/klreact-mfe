import React, { forwardRef, useRef, useState, useEffect, useImperativeHandle } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { defaultTheme } from "../themes";

const NervCarousel = forwardRef((props, ref) => {
  const { infinityItems, xlItems, lgItems, mdItems, smItems, xsItems, customButtonGroup, currentSlideCallback } = props;

  const cRef = useRef();
  const [numOfSlides, setNumOfSlides] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [breakpoint, setBreakpoint] = useState("md");
  const [startOfSlides, setStartOfSlides] = useState(true);
  const [endOfSlides, setEndOfSlides] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { breakpoints } = defaultTheme;

  const defaultResponsive = {
    infinity: {
      breakpoint: { max: 5000, min: breakpoints.values.xl + 1 },
      items: infinityItems || 4,
    },
    xl: {
      breakpoint: {
        max: breakpoints.values.xl,
        min: breakpoints.values.lg + 1,
      },
      items: xlItems || 4,
    },
    lg: {
      breakpoint: {
        max: breakpoints.values.lg,
        min: breakpoints.values.md + 1,
      },
      items: lgItems || 3,
    },
    md: {
      breakpoint: {
        max: breakpoints.values.md,
        min: breakpoints.values.sm + 1,
      },
      items: mdItems || 2,
    },
    sm: {
      breakpoint: {
        max: breakpoints.values.sm,
        min: breakpoints.values.xs + 1,
      },
      items: smItems || 1,
    },
    xs: {
      breakpoint: { max: breakpoints.values.xs, min: 0 },
      items: xsItems || 1,
    },
  };

  useImperativeHandle(ref, () => ({
    next: handleNextSlide,
    prev: handlePrevSlide,
    getTotalItems: () => (cRef.current.state.totalItems),
  }));

  useEffect(() => {
    setBreakpoint(props.bp);
  });

  useEffect(() => {
    if (currentSlide === 0) {
      setStartOfSlides(true);
    } else {
      setStartOfSlides(false);
    }

    const lastSlideShown = currentSlide + cRef.current.state.slidesToShow - 1;

    if (
      currentSlide === cRef.current.state.totalItems - 1 ||
      lastSlideShown >= cRef.current.state.totalItems - 1
    ) {
      setEndOfSlides(true);
    } else {
      setEndOfSlides(false);
    }

    if (typeof currentSlideCallback === 'function')
      currentSlideCallback(currentSlide);
  }, [currentSlide]);

  useEffect(() => {
    const newWidth = window.innerWidth;
    setWindowWidth(newWidth);

    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    setNumOfSlides(cRef.current?.state.slidesToShow);
  }, [windowWidth]);

  const colourOpacityLeftChevron = () =>
    startOfSlides
      ? "solid 1px rgba(0,103,177, 0.5)"
      : "solid 1px rgba(0,103,177, 1)";
  const colourOpacityRightChevron = () =>
    endOfSlides
      ? "solid 1px rgba(0,103,177, 0.5)"
      : "solid 1px rgba(0,103,177, 1)";

  const calcBpMargin = () => {
    if (breakpoint === "sm") return 92;
    else return 0;
  };

  const handleChange = (previousSlide, { currentSlide, onMove }) => {
    setCurrentSlide(currentSlide);
  };

  const handlePrevSlide = () => {
    if (startOfSlides) return;

    const goToSlideVar =
      cRef.current.state.currentSlide - cRef.current.state.slidesToShow;

    if (goToSlideVar >= 0) {
      cRef.current.goToSlide(goToSlideVar);
    } else if (goToSlideVar < 0) {
      cRef.current.goToSlide(0);
    }
  };

  const handleNextSlide = () => {
    if (endOfSlides) return;

    const goToSlideVar =
      cRef.current.state.currentSlide + cRef.current.state.slidesToShow;

    if (goToSlideVar <= cRef.current.state.totalItems) {
      cRef.current.goToSlide(goToSlideVar);
    } else if (goToSlideVar > cRef.current.state.totalItems - 1) {
      cRef.current.goToSlide(
        cRef.current.state.totalItems -
          (cRef.current.state.totalItems % cRef.current.state.slidesToShow)
      );
    }
  };

  return (
    <div style={{ position: "relative", marginTop: calcBpMargin() }}>
      {numOfSlides > 1 && !props.hideChevron && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            position: "absolute",
            right: 5,
            top: -68,
          }}
        >
          <div
            style={{
              display: "flex",
              height: 44,
              width: 44,
              color: startOfSlides
                ? "rgba(0,103,177, 0.5)"
                : "rgba(0,103,177, 1)",
              border: colourOpacityLeftChevron(),
              borderRadius: 44,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <ChevronLeftIcon onClick={handlePrevSlide} />
          </div>
          <div
            style={{
              display: "flex",
              height: 44,
              width: 44,
              color: endOfSlides
                ? "rgba(0,103,177, 0.5)"
                : "rgba(0,103,177, 1)",
              border: colourOpacityRightChevron(),
              borderRadius: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRightIcon onClick={handleNextSlide} />
          </div>
        </div>
      )}
      <Carousel
        {...props}
        responsive={props.responsive || defaultResponsive}
        ref={cRef}
        afterChange={handleChange}
        showDots={breakpoint === "xs"}
        style={{ position: "relative" }}
        customDot={breakpoint === "xs" && <CustomDot />}
        renderDotsOutside={true}
        customButtonGroup={customButtonGroup}
      >
        {props.children}
      </Carousel>
    </div>
  );
});

const CustomDot = ({ onClick, ...rest }) => {
  const {
    onMove,
    index,
    active,
    carouselState: { currentSlide, deviceType },
  } = rest;

  // onMove means if dragging or swiping in progress.
  // active is provided by this lib for checking if the item is active or not.
  return (
    <div
      className={active ? "active" : "inactive"}
      style={{
        position: "relative",
        top: 32,
        width: 11,
        height: 11,
        borderRadius: 11,
        marginLeft: 4.5,
        marginRight: 4.5,
        backgroundColor: active ? "#5bc2e7" : "#d8d8d8",
      }}
      onClick={() => onClick()}
    />
  );
};

export { NervCarousel };
