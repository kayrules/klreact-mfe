import React from "react";
import { Box, Button, Typography } from "@klreact-mfe/mfe-ui";
import { includeBp, getDeviceConfig } from "../utils";

const alertItem = [
  {
    title: "Welcome to RHB Online Banking",
    date: "Friday, 12 July 2019",
    message:
      "Banking Right by You! Download RHB Mobile Banking App to get simple and seamless banking experience.",
    readFlag: false,
    action: "pay",
    actionText: "PAY NOW",
  },
  {
    title: "Trade and Win - Stand a Change to Drive Home a Mazda",
    date: "Monday, 10 April 2019",
    message:
      "Trade equities and/or futures in all markets with RHB, and entries will be accorded to you based on cumulative brokerage/commission.",
    readFlag: false,
    action: "",
    actionText: "",
  },
];

const RenderItem = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        marginLeft: "10px",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderBottom: !props.lastItem && '1px solid #e5e7e9',
        paddingTop: '16px',
        paddingBottom: '16px',
      }}
    >
      {!props.readFlag && (
        <Box
          sx={{
            left: "-28px",
            top: "23px",
            position: "absolute",
            backgroundColor: "#ef3e42",
            width: "8px",
            height: "8px",
            borderRadius: "4px",
          }}
        />
      )}
      <Box
        sx={{ display: "flex", position: "relative", flexDirection: "column" }}
      >
        <Typography
          sx={{ fontSize: "14px", fontWeight: "bold", color: "#424b57" }}
        >
          {props.title}
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "#424b57" }}>
          {props.date}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            color: "#424b57",
            marginTop: "8px",
            marginBottom: "16px",
          }}
        >
          {props.message}
        </Typography>
        {props.action && <Button
          variant="contained"
          disableElevation
          sx={{
            fontFamily: "Lato",
            fontSize: "12px",
            fontWeight: "bold",
            maxWidth: "90px",
            paddingLeft: "16px",
            paddingRight: "16px",
            margin: "0px",
            whiteSpace: "nowrap",
            right: "0px",
            top: "-2px",
            backgroundColor: "#0067b1",
            borderRadius: 18,
            marginRight: "6px",
          }}
        >
          {props.actionText}
        </Button>}
      </Box>
    </Box>
  );
};

const Alerts = (props) => {
  const { headerHeight } = props;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", marginLeft: "26px", minHeight: window.innerHeight - (headerHeight || 0) }}>
      <Typography
        sx={{
          fontFamily: "Lato",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#424b57",
          marginTop: "30px",
          marginBottom: "15px",
          marginLeft: "10px",
        }}
      >
        Alerts
      </Typography>
      {alertItem.map((item, key) => (
        <RenderItem {...item} lastItem={key === alertItem.length - 1} />
      ))}
    </Box>
  );
};

export default Alerts;
