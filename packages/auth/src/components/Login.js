import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Typography,
  Grid,
  TextField,
  Box,
  useDimensions,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@klreact-mfe/mfe-ui";
import secureImage from "../assets/secure-image.jpg";
import styles from "./styles";

const Login = () => {
  const loginRef = useRef(null);
  const { width } = useDimensions(loginRef);
  const history = useHistory();

  const [secretPhrase, showSecretPhrase] = useState(false);
  const [secureWordWidth, setSecureWordWidth] = useState(0);
  const [loginPressed, setLoginPressed] = useState(false);
  const [isSecureWord, setIsSecureWord] = useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const shrink = username.length > 0;
  const passwordEntered = password.length > 0;

  useEffect(() => {
    if (loginRef.current) {
      setSecureWordWidth(width);
    }
  }, [width]);

  useEffect(() => {
    if (secretPhrase) {
      setLoginPressed(true);
    } else {
      setLoginPressed(false);
    }
  }, [secretPhrase]);

  const onGetSecretPhrase = (event) => {
    event.preventDefault();

    const usernameWithoutSpaces = username?.replace(/^\s+|\s+$/g, "");
    if (usernameWithoutSpaces.length >= 6) {
      showSecretPhrase(true);
    } else {
      // return error here
      console.error("Must be at least 6 chars");
    }
  };

  const onLogin = (event) => {
    event.preventDefault();
    const data = {
      userId: username,
      password: password,
    };
    history.push("/dashboard");
  };

  return (
    <>
      <Grid
        container
        ref={loginRef}
        spacing={0}
        sx={{ ...styles.mainContainer, ...styles.usernameContainer }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={
            loginPressed
              ? { ...styles.gridSubContainer, ...styles.greyBg }
              : { ...styles.gridSubContainer }
          }
        >
          <Box sx={styles.outerBox}>
            <TextField
              label="Username"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: loginPressed ? styles.inputWithoutLabel : styles.input,
              }}
              InputLabelProps={{
                sx: loginPressed
                  ? styles.inputLabelDisappear
                  : focused || shrink
                  ? styles.inputLabelFocused
                  : styles.inputLabelNoShrink,
              }}
              onChange={(event) => setUsername(event.target.value)}
              onFocus={(event) => {
                setFocused(true);
              }}
              onBlur={(event) => {
                setFocused(false);
              }}
              fullWidth
              disabled={loginPressed}
            />
            {!loginPressed && (
              <Button
                variant="contained"
                color="primary"
                disableElevation
                size="small"
                sx={styles.loginButton}
                disabled={!shrink}
                onClick={onGetSecretPhrase}
              >
                LOG IN
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      {loginPressed && (
        <Grid
          container
          sx={{
            ...styles.mainContainer,
            ...styles.secureWordContainer,
            width: secureWordWidth,
          }}
        >
          <Grid
            container
            style={{ justifyContent: "center", paddingTop: "24px" }}
          >
            <Grid item sx={styles.blueBox}>
              <Box
                component="img"
                src={secureImage}
                alt="Secure Image"
                sx={styles.secureImage}
              />
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "center",
              paddingTop: "16px",
              paddingBottom: "16px",
            }}
          >
            <Grid item>
              <Typography sx={styles.darkGreyText} align="center">
                Confirm this is your Secure Image?
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "center",
              paddingBottom: "20px",
            }}
          >
            <CheckCircleIcon
              sx={styles.checkCircleIcon}
              style={{ color: isSecureWord ? "#0067b1" : "#424b57" }}
              onClick={(event) => setIsSecureWord(true)}
            />
            <CancelIcon
              sx={styles.cancelIcon}
              onClick={(event) => {
                setLoginPressed(false);
                setIsSecureWord(false);
              }}
            />
          </Grid>
          {isSecureWord && (
            <Grid
              container
              sx={{
                justifyContent: "flex-end",
                paddingBottom: "20px",
              }}
            >
              <TextField
                label="Password"
                variant="filled"
                fullWidth
                type="password"
                sx={styles.passwordInput}
                InputProps={{
                  sx: styles.passwordInputProp,
                }}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                disableElevation
                size="small"
                sx={styles.secureWordButton}
                disabled={!passwordEntered}
                onClick={onLogin}
              >
                LOG IN
              </Button>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};

export default Login;
