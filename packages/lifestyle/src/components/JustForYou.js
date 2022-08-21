import React, { useEffect, useState } from "react";
import { Box, MockComponent, Typography } from "@klreact-mfe/mfe-ui";
import { throttle } from "lodash";
import outlinePinSvg from "../assets/icons-outline-pin.svg";
import outlineShareSvg from "../assets/icons-outline-share.svg";

const data = [
  {
    key: 1,
    title:
      "The Encounter : Starring Kendall Jenner. 20% off Long Champ Bags - Spring Season Collection.",
    imageUrl:
      "https://paultan.org/image/2021/09/Honda-e-EV-feature-lead-630x401.jpg",
    originalPrice: "98999",
    discountedPrice: "525200",
    discountPercent: "30%",
    onClick: "",
  },
  {
    key: 2,
    title:
      "Classic Burger Carl’s Jr Malaysia. Get 50% voucher and enjoy your Favourite Food at Home!",
    imageUrl:
      "https://i.insider.com/5bbd187101145529745a9895?width=700",
    originalPrice: "1099",
    discountedPrice: "99900",
    discountPercent: "30%",
    onClick: "",
  },
  {
    key: 3,
    title:
      "Don't miss out to be the first to own it. All-new Samsung Galaxy Note10 | Pre-Order is available now‎",
    imageUrl:
      "https://www.cnet.com/a/img/resize/00461a3492b84210e52b49d6676bb45e8ab912d4/hub/2019/08/17/b8ed4f9d-c156-40c9-b907-5e55165da33f/samsung-galaxy-note-10-plus-18.jpg?auto=webp&width=1092",
    originalPrice: "1099",
    discountedPrice: "525200",
    discountPercent: "30%",
    onClick: "",
  },
  {
    key: 4,
    title:
      "The Encounter : Starring Kendall Jenner. 20% off Long Champ Bags - Spring Season Collection.",
    imageUrl:
      "https://i1.wp.com/motomalaya.net/blog/wp-content/uploads/2019/04/Kawasaki-H2SX-SE-1.jpg?ssl=1",
    originalPrice: "1099",
    discountedPrice: "525200",
    discountPercent: "30%",
    onClick: "",
  },
  {
    key: 5,
    title:
      "Don't miss out to be the first to own it. All-new Samsung Galaxy Note10 | Pre-Order is available now‎",
    imageUrl: "http://www.utusan.com.my/wp-content/uploads/harimau-7.jpg",
    originalPrice: "1099",
    discountedPrice: "525200",
    discountPercent: "30%",
    onClick: "",
  },
  {
    key: 6,
    title:
      "The Encounter : Starring Kendall Jenner. 20% off Long Champ Bags - Spring Season Collection.",
    imageUrl:
      "https://assets.theedgemarkets.com/RHB-Bank-2_theedgemarkets.jpg?ZX6PsJShVW0fNPHi25REDuJRqm_oLVhs",
    originalPrice: "1099",
    discountedPrice: "525200",
    discountPercent: "30%",
    onClick: "",
  },
];

// to put into util
const numberWithCommas = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const JustForYou = (props) => {
  const { mocked, numberOfItems } = props;
  const [justForYouWidth, setJustForYouWidth] = useState(0);

  useEffect(() => {
    setJustForYouWidth(
      document.querySelector("#justForYou").clientWidth
    );

    const calcInnerWidth = throttle(function () {
      setJustForYouWidth(
        document.querySelector("#justForYou").clientWidth
      );
    }, 200);
    window.addEventListener("resize", calcInnerWidth);

    return () => {
      window.removeEventListener("resize", calcInnerWidth);
    };
  }, []);

  const calculateWidth = (numOfItems, padding = 24) => {
    return ((justForYouWidth - 1) - (padding * (numOfItems - 1))) / numOfItems;
  };

  const ItemRenderer = (props, key) => {
    const { title, imageUrl, originalPrice, discountedPrice, discountPercent } =
      props;

    const cardWidth = calculateWidth(numberOfItems);

    return (
      <Box
        sx={{
          display: "flex",
          width: cardWidth,
          flexDirection: "column",
          justifyContent: 'space-between',
          marginRight: key % numberOfItems === 0 ? '0px' : '24px',
        }}
        key={key}
      >
        <div
          style={{
            position: "relative",
            height: numberOfItems > 1 ? "193px" : 'auto',
            width: numberOfItems > 1 ? "auto" : '100%',
            backgroundColor: "#edf1f6",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{ position: "absolute", zIndex: 2, right: "10px", top: "14px" }}
          >
            <img src={outlineShareSvg} style={{ marginRight: "12px" }} />
            <img src={outlinePinSvg} />
          </Box>
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundImage:
                "linear-gradient(to top, rgba(0, 0, 0, 0) 66%, rgba(0, 0, 0, 0.9))",
              zIndex: 1,
            }}
          />
          <img src={imageUrl} style={{ position: 'relative', height: "auto", width: "100%", objectFit: 'cover' }} />
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "12px",
            marginBottom: "38px",
          }}
        >
          <Typography
            sx={{ fontFamily: "Lato", fontSize: "14px", color: "#424b57" }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontWeight: "bold",
              fontSize: "20px",
              color: "#0268b1",
            }}
          >
            MYR {numberWithCommas((discountedPrice / 100).toFixed(2))}
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "12px",
                color: "#8c949e",
                textDecoration: "line-through",
              }}
            >
              MYR {numberWithCommas((originalPrice / 100).toFixed(2))}
            </Typography>
            <Box
              sx={{
                display: "flex",
                backgroundColor: "#0268b1",
                borderRadius: "4px",
                width: "32px",
                paddingTop: 0,
                paddingBottom: 0,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "6px",
                height: "16px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "12px",
                  color: "#fff",
                  padding: "4px",
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  textAlign: "center",
                }}
              >
                {discountPercent}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  if (mocked) {
    return <MockComponent />;
  }

  return (
    <React.Fragment>
      <Box
        id="justForYou"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Typography
          sx={{
            color: "#424b57",
            fontFamily: "Lato",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Just For You
        </Typography>
        <Typography
          sx={{
            color: "#0067b1",
            fontFamily: "Lato",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          EXPLORE MORE
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {data.map((item, key) => ItemRenderer(item, key + 1))}
      </Box>
    </React.Fragment>
  );
};

export default JustForYou;
