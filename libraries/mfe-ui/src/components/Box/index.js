import React from "react";
import MuiBox from "@mui/material/Box";

const boxStyle = {
  backgroundColor: '#5bc2e7',
  color: 'white',
  padding: '20px',
};

const Box = (props) => {
  return (
    <MuiBox sx={{ ...boxStyle, ...props.sx}} {...props}>
      {props.children}
    </MuiBox>
  );
}

export { Box };
