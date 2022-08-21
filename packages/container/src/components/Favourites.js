import { Box, Typography, Add as AddIcon } from "@klreact-mfe/mfe-ui";
import React from "react";

const favData = [
  {
    name: "Nadia Zaki",
    imageUrl: "",
    url: "",
  },
  {
    name: "Zahfy",
    imageUrl: "",
    url: "",
  },
];

const FavIcon = (props) => {
  const handleInitials = (name) => {
    var initials = "";
    const splitedName = name.split(" ");
    if (splitedName.length === 1) {
      initials = splitedName[0][0];
    } else {
      initials = splitedName[0][0] + splitedName[1][0];
    }
    return (
      <Typography
        sx={{ textAlign: "center", color: "#ffffff", fontSize: "16px" }}
      >
        {initials}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: "28px",
        paddingRight: "28px",
        marginBottom: "38px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "20px",
          backgroundColor: props.addItem === true ? "#edf1f6" : "#0067b1",
          overflow: "hidden",
        }}
      >
        {props.addItem === true ? (
          <AddIcon sx={{ color: "#0067b1" }} />
        ) : props.imageUrl !== "" ? (
          <img
            draggable="false"
            src={props.imageUrl}
            style={{
              position: "relative",
              borderRadius: 20,
              width: "40px",
              height: "40px",
              border: "3px solid #ffffff",
            }}
          />
        ) : (
          handleInitials(props.name)
        )}
        <Typography
          sx={{
            position: "absolute",
            top: 44,
            textAlign: "center",
            color: "#424b57",
            fontSize: "12px",
          }}
        >
          {props.name}
        </Typography>
      </Box>
    </Box>
  );
};

const Favourites = () => {
  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "135px",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <FavIcon addItem={true} />
        {favData.map((item, key) => (
          <FavIcon {...item} />
        ))}
      </Box>
      {favData.length > 0 && (
        <Box
          sx={{
            display: "flex",
            position: "relative",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "38px",
          }}
        >
          <Typography
            sx={{
              height: "60px",
              color: "#0067b1",
              fontWeight: "bold",
              fontSize: "12px",
              opacity: 0.5,
            }}
          >
            EDIT
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Favourites;
