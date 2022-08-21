import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, Button, Typography } from "@klreact-mfe/mfe-ui";
import logo from "../assets/rhb-logo.svg";
import { includeBp, getDeviceConfig } from "../utils";
import { throttle } from "lodash";
import ProfilePicPlaceholder from "../assets/profile-pic-placeholder.png";
import WhiteSettingsSvg from "../assets/icons-white-settings.svg";
import WhiteInboxSvg from "../assets/icons-white-inbox.svg";
import MenuSvg from "../assets/icons-menu.svg";
import moment from 'moment';

const styles = {
  "@global": {
    body: {
      margin: 0,
    },
    a: {
      textDecoration: "none",
    },
  },
  outerContainer: {
    maxWidth: "1650px",
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
    minWidth: '352px',
  },
  appBar: {
    borderBottom: `1px solid none`,
    backgroundColor: "transparent",
  },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    padding: "0 42px",
    minHeight: "70px",
    alignItems: "center",
  },
  logo: {
    width: "74px",
    height: "27px",
    marginBottom: "5px",
    marginRight: "20px",
  },
  barLink: {
    color: "#fff",
    fontSize: "14px",
    margin: "0 18px",
  },
  profilePic: {
    width: 62,
    height: 62,
    border: "3px solid #ffffff",
    borderRadius: "51px",
  },
  profilePicBorder: {
    display: "flex",
    width: 68,
    height: 68,
    borderRadius: "51px",
    backgroundImage: "linear-gradient(111deg, #5bc2e7 23%, #1078b9 128%)",
    justifyContent: "center",
    alignItems: "center",
  },
  icons: {
    margin: "0 0 0 17px",
  },
};

export default function Header({ signedIn, onSignOut }) {
  const headerHeightFull = 238;
  const headerHeightSmall = 62;

  const [currentBP, setCurrentBP] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerPosition, setHeaderPosition] = useState("relative");
  const [isSmall, setIsSmall] = useState(false);

  const [inboxNotification, setInboxNotification] = useState(true);

  useEffect(() => {
    if (headerHeight === headerHeightSmall) {
      setIsSmall(true);
    } else {
      setIsSmall(false);
    }
  }, [headerHeight]);

  useEffect(() => {
    if (currentBP === "") {
      setCurrentBP(getDeviceConfig(window.innerWidth));
      if (
        window.scrollY >= 0 &&
        window.scrollY < headerHeightFull - headerHeightSmall
      ) {
        setHeaderHeight(headerHeightFull);
      } else {
        setHeaderHeight(headerHeightSmall);
      }
    }

    // Calculate BP
    const calcInnerWidth = throttle(function () {
      setCurrentBP(getDeviceConfig(window.innerWidth));
      if (
        window.scrollY >= 0 &&
        window.scrollY < headerHeightFull - headerHeightSmall
      ) {
        setHeaderHeight(headerHeightFull);
        setIsSmall(false);
      } else {
        setHeaderHeight(headerHeightSmall);
        setIsSmall(true);
      }
    }, 200);
    window.addEventListener("resize", calcInnerWidth);

    // Sticky
    if (window.location.pathname === "/dashboard") {
      const scrollCallBack = window.addEventListener("scroll", () => {
        if (window.scrollY > headerHeightFull - headerHeightSmall) {
          setHeaderPosition("fixed");
          setHeaderHeight(headerHeightSmall);
          setIsSmall(true);
        } else {
          setHeaderPosition("relative");
          setHeaderHeight(headerHeightFull);
          setIsSmall(false);
        }
      });
    }

    return () => {
      window.removeEventListener("resize", calcInnerWidth);
      if (window.location.pathname === "/dashboard")
        window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);

  const onClick = () => {
    if (signedIn && onSignOut) {
      onSignOut();
    }
  };

  const checkPath = (path) => {
    if (window.location.pathname === path) return true;
    return false;
  };

  const includePath = (arrayVar) => {
    var returnValue = false;
    if (typeof arrayVar === "object" && Array.isArray(arrayVar)) {
      arrayVar.forEach((path) => {
        if (window.location.pathname === path) {
          returnValue = true;
          return;
        }
      });
    }
    return returnValue;
  };

  const appBarContainerSmallStyle = () => {
    if (checkPath("/dashboard")) {
      return {
        backgroundColor: "#5bc2e7",
        position: headerPosition,
        width: "100%",
        left: headerPosition === "fixed" && "50%",
        transform: headerPosition === "fixed" && "translate(-50%, 0)",
      };
    } else if (checkPath("/")) {
      return {};
    } else {
      return {
        backgroundColor: "#5bc2e7",
        marginBottom: "18px",
        position: "fixed",
        width: "100%",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
      };
    }
  };

  const appBarAnim = () => {
    if (checkPath("/dashboard")) {
      return {
        position: headerPosition === "fixed" && "absolute",
        transform:
          headerPosition !== "fixed"
            ? "translate(0, 0)"
            : "translate(0, 100px)",
        top: "-100px",
      };
    }
  };

  const handleGreetingTime = () => {
    var m = moment().utcOffset('+08:00');
    var g = null; //return g

    if (!m || !m.isValid()) {
      return 'day';
    } //if we can't find a valid or filled moment, we return.

    var split_afternoon = 12; //24hr time to split the afternoon
    var split_evening = 17; //24hr time to split the evening
    var currentHour = parseFloat(m.format('HH'));

    if (currentHour >= split_afternoon && currentHour <= split_evening) {
      g = 'afternoon';
    } else if (currentHour >= split_evening) {
      g = 'evening';
    } else {
      g = 'morning';
    }
    return g;
  };

  const handleGreetings = () => {
    return (
      <Typography sx={{ fontSize: includeBp(["xs", "sm"]) ? "16px" : "20px" }}>
        Good {handleGreetingTime()}, Eusof Adha
      </Typography>
    );
  };

  const handleToDo = () => {
    return (
      <Typography
        sx={{
          fontSize: includeBp(["xs", "sm"]) ? "16px" : "22px",
          fontWeight: "bold",
        }}
      >
        What would you like to do?
      </Typography>
    );
  };

  const isCurrentPage = (name, altName) => {
    if (
      window.location.pathname === "/" + name?.toLowerCase() ||
      window.location.pathname === "/" + altName?.toLowerCase()
    )
      return true;
    return false;
  };

  const handleButtons = (buttonArray = []) => {
    const buttonData = [
      {
        name: "Home",
        altName: "Dashboard",
        onClick: () => {
          alert("This is home");
        },
      },
      {
        name: "Apply",
        onClick: () => {
          alert("This is apply");
        },
      },
      {
        name: "Accounts",
        onClick: () => {
          alert("This is account");
        },
      },
      {
        name: "Pay",
        onClick: () => {
          alert("This is pay");
        },
      },
      {
        name: "DuitNow",
        onClick: () => {
          alert("This is duitnow");
        },
      },
      {
        name: "Top Up",
        onClick: () => {
          alert("This is top up");
        },
      },
      {
        name: "Invest",
        onClick: () => {
          alert("This is invest");
        },
      },
      {
        name: "Explore",
        onClick: () => {
          alert("This is explore");
        },
      },
    ];

    const dashboardMenu = {
      height: "26px",
      marginRight: "6px",
      borderRadius: "15px",
      alignItems: "center",
    };

    const typicalMenu = {
      height: "30px",
      marginRight: includeBp(['xs', 'sm']) ? '10px' : "16px",
      borderRadius: "15px",
      backgroundColor: "#5bc2e7",
      border: "1px solid #fff",
      alignItems: "center",
      marginBottom: includeBp(["xs", "sm"]) && "8px",
    };

    const RenderButton = (props) => {
      return (
        <Button
          sx={
            isSmall
              ? {
                  ...dashboardMenu,
                  backgroundColor:
                    isCurrentPage(props.name, props.altName) &&
                    "rgba(255,255,255,0.2)",
                }
              : typicalMenu
          }
          onClick={props.onClick}
        >
          <Typography
            sx={{
              color: "#fff",
              fontSize: includeBp(["xs", "sm"]) ? "12px" : "14px",
              textTransform: "capitalize",
              paddingLeft: includeBp(["xs", "sm"]) ? "12px" : "16px",
              paddingRight: includeBp(["xs", "sm"]) ? "12px" : "16px",
            }}
          >
            {props.name}
          </Typography>
        </Button>
      );
    };

    return buttonData.map((item, keyIdx) => {
      var renderAll = buttonArray.length === 0;

      if (isSmall && includeBp(['xs', 'sm', 'md', 'lg'])) {
        return null;
      }

      if (renderAll === false) {
        var toRenderButton = false;
        buttonArray.forEach((name) => {
          if (item.name === name) {
            toRenderButton = true;
          }
        });
        if (toRenderButton) {
          return (
            <RenderButton
              key={keyIdx}
              name={item.name}
              altName={item.altName}
              onClick={item.onClick}
            />
          );
        }
      } else {
        return (
          <RenderButton
            key={keyIdx}
            name={item.name}
            altName={item.altName}
            onClick={item.onClick}
          />
        );
      }
    });
  };

  const LastLogin = (props) => (
    <Box sx={{ display: "flex", position: includeBp(['xs', 'sm']) && 'absolute', bottom: includeBp(['xs', 'sm']) && '8px' }}>
      <Typography sx={{ fontSize: includeBp(['xs', 'sm', 'md']) ? '10px' : "12px", color: "rgba(255,255,255,0.6)" }}>
        Your last login was on{" "}
        {props.lastLogin || "Thursday, 27 October 2020 at 9:45AM"}
      </Typography>
    </Box>
  );

  const DashboardBanner = (props) => {
    return (
      <Box
        sx={{
          position: "relative",
          bottom: 0,
          width: "90%",
          maxWidth: "1425px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            backgroundImage:
              "radial-gradient(circle at 47% -16%, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0) 92%)",
            width: "100%",
            height: "174px",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              backgroundColor: "#5bc2e7",
              backgroundImage:
                "linear-gradient(to bottom, rgba(91, 194, 231, 0.1) -14%, rgba(91, 194, 231, 0.07) 51%, rgba(91, 194, 231, 0) 77%)",
              backgroundBlendMode: "multiply",
              width: "100%",
              height: "173px",
              borderRadius: "12px 12px 0 0",
              paddingLeft: includeBp(["xs", "sm"]) ? "20px" : "30px",
              paddingRight: includeBp(["xs", "sm"]) ? "20px" : "30px",
              paddingTop: includeBp(["xs", "sm"]) ? "20px" : "30px",
              paddingBottom: includeBp(["xs", "sm"]) ? "20px" : "30px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {!includeBp(["xs", "sm"]) && (
                  <Box sx={styles.profilePicBorder}>
                    <img
                      src={ProfilePicPlaceholder}
                      style={styles.profilePic}
                    />
                  </Box>
                )}
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', marginLeft: includeBp(["xs", "sm"]) ? "0px" : "16px" }}
                >
                  {handleGreetings()}
                  {handleToDo()}
                </Box>
              </Box>
              {!includeBp(["xs", "sm"]) && <LastLogin lastLogin="" />}
            </Box>
            <Box
              sx={{
                display: 'flex',
                backgroundColor: "",
                marginTop: includeBp(["xs", "sm"]) ? "10px" : "21px",
                marginLeft: includeBp(["xs", "sm"]) ? "0px" : "85px",
                height: '100%',
                alignItems: 'center',
              }}
            >
              <Box sx={{ backgroundColor: ''}}>
              {handleButtons([
                "Accounts",
                "Pay",
                "DuitNow",
                "Top Up",
                "Invest",
                "Explore",
              ])}
              </Box>
            </Box>
            {includeBp(["xs", "sm"]) && <LastLogin lastLogin="" />}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <React.Fragment>
      {checkPath("/dashboard") && (
        <Box
          style={{
            position: headerPosition === "fixed" ? "fixed" : "absolute",
            width: "100%",
            height: headerHeight,
            left: 0,
            paddingLeft: 138,
            paddingRight: 138,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1,
          }}
        />
      )}
      <Box
        sx={{
          ...styles.outerContainer,
          ...appBarContainerSmallStyle(),
          zIndex: 1,
        }}
      >
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ ...styles.appBar, ...appBarAnim() }}
        >
          <Toolbar sx={styles.toolbar}>
            {!includeBp(["xl"]) && !includePath(['/']) && (
              <Box
                sx={{
                  display: "flex",
                  marginRight: "10px",
                  marginBottom: "7px",
                }}
              >
                <img src={MenuSvg} alt="Menu" />
              </Box>
            )}
            <a href="/">
              <img src={logo} alt="Logo" sx={styles.logo} />
            </a>
            {isSmall && (
              <Box sx={{ display: "flex", marginLeft: "40px" }}>
                {handleButtons(["Home", "Apply", "Accounts", "Explore"])}
              </Box>
            )}
            {!includePath(["/"]) && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  position: "absolute",
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {includeBp(["md", "lg", "xl"]) && isSmall && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        borderLeft: "1px solid #fff",
                      }}
                    >
                      <Typography
                        color="inherit"
                        sx={{ ...styles.barLink }}
                        noWrap
                        to="/"
                      >
                        PAY
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        borderLeft: "1px solid #fff",
                      }}
                    >
                      <Typography
                        color="inherit"
                        sx={{ ...styles.barLink }}
                        noWrap
                        to="/"
                      >
                        Duit Now
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        borderLeft: "1px solid #fff",
                        borderRight: "1px solid #fff",
                      }}
                    >
                      <Typography
                        color="inherit"
                        sx={{ ...styles.barLink }}
                        noWrap
                        to="/"
                      >
                        TOP UP
                      </Typography>
                    </Box>
                  </>
                )}
                <Box sx={{ display: "flex" }}>
                  <img src={WhiteSettingsSvg} style={styles.icons} />
                </Box>
                <Box sx={{ display: "flex", position: "relative" }}>
                  <img src={WhiteInboxSvg} style={styles.icons} />
                  {inboxNotification && (
                    <Box
                      sx={{
                        display: "flex",
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "#ef3e42",
                        width: "10px",
                        height: "10px",
                        borderRadius: "5px",
                      }}
                    ></Box>
                  )}
                </Box>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    color="inherit"
                    sx={{ ...styles.barLink }}
                    noWrap
                    to="/"
                  >
                    LOG OUT
                  </Typography>
                </Box>
              </Box>
            )}
            {/* <Typography color="inherit" sx={styles.barLink} noWrap component={RouterLink} to="/">
              RHB Mobile Banking
            </Typography>
            <Typography color="inherit" sx={styles.barLink} noWrap component={RouterLink} to="/">
              Get Help &amp; Support
            </Typography>
            <Button
              color="primary"
              variant="outlined"
              sx={styles.barLink}
              component={RouterLink}
              to={signedIn ? "/" : "/auth/signin"}
              onClick={onClick}
            >
              {signedIn ? "Logout" : "Login"}
            </Button> */}
          </Toolbar>
        </AppBar>
        {checkPath("/dashboard") && headerPosition === "relative" && (
          <Box
            style={{
              display: "flex",
              padding: 0,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <DashboardBanner currentBP={currentBP} />
          </Box>
        )}
      </Box>
      {checkPath("/dashboard") && headerPosition === "fixed" && (
        <Box
          style={{
            width: "100%",
            height: headerHeightFull + 10,
            backgroundColor: "#ffffff",
          }}
        ></Box>
      )}
    </React.Fragment>
  );
}
