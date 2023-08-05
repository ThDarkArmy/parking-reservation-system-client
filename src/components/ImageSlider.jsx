import React from "react";

import Carousel from "react-material-ui-carousel";

import { Paper, Button } from "@mui/material";

const ImageSlider = ({topImages}) => {
  return (
    <div>
      <Carousel interval={4000} animation="slide" indicators={false}>
        {topImages.map((item, i) => (
          <img key={i} src={item} style={{ height: 500, width: "100%"}} />
        ))}
      </Carousel>
    </div>
  );
};

export default ImageSlider;