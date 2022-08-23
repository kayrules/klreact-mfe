import React from "react";
import { NervCarousel } from "@klreact-mfe/mfe-ui";

const HomeCarousel = (props) => {
  const lifeStyleOffers = [
    {
      id: 1,
      imageUrl:
      "https://assets.imgix.net/unsplash/citystreet.jpg?w=291&h=262&crop=center&fit=crop",
    },
    {
      id: 2,
      imageUrl:
        "https://assets.imgix.net/unsplash/bridge.jpg?w=291&h=262&crop=center&fit=crop",
    },
    // {
    //   id: 3,
    //   imageUrl:
    //   "https://assets.imgix.net/unsplash/vintagecameras.jpg?w=291&h=262&crop=center&fit=crop",
    // },
    // {
    //   id: 4,
    //   imageUrl:
    //     "https://assets.imgix.net/unsplash/motorbike.jpg?w=291&h=262&crop=center&fit=crop",
    // },
    // {
    //   id: 5,
    //   imageUrl:
    //     "https://assets.imgix.net/unsplash/transport.jpg?w=291&h=262&crop=center&fit=crop",
    // },
    // {
    //   id: 6,
    //   imageUrl:
    //     "https://assets.imgix.net/examples/balloons.jpg?w=291&h=262&crop=center&fit=crop",
    // },
  ];

  const ItemRenderer = (props) => {
    return (
      <div style={{ padding: 5 }}>
        <img
          draggable="false"
          src={props.imageUrl}
          style={{ borderRadius: 9, width: "100%" }}
        />
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <NervCarousel
        containerClass="carousel-container"
        ssr={true}
        arrows={false}
        {...props}
      >
        {lifeStyleOffers.map((item) => (
          <ItemRenderer key={item.id} imageUrl={item.imageUrl} />
        ))}
      </NervCarousel>
    </div>
  );
};

export default HomeCarousel;
