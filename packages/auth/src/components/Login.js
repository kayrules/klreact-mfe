import React, { useState, useRef, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import {
  Button,
  Typography,
  Grid,
  TextField,
  Box,
  useDimensions,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from "@klreact-mfe/mfe-ui";
import { isMicro } from '../utils/micro';
import { retrieveData } from '../utils/persistState';
import {
  constructPWPadding,
  encryptDataHsm,
  decryptHsm
} from '../utils/CryptoProvider';
import { init } from '../redux/slices/login/init';
import { getSecretPhrase } from '../redux/slices/preLogin/getSecretPhrase';
import { login } from '../redux/slices/login/login';

const styles = {
  mainContainer: {
    borderRadius: '7px',
    backgroundColor: "white",
    boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
    alignItems: "center",
  },
  usernameContainer: {
    height: '48px',
    justifyContent: "space-between",
  },
  secureWordContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: '4px',
    position: 'absolute',
    width: 'inherit',
    zIndex: 1,
  },
  input: {
    height: '35px',
    marginTop: "0px !important",
    fontSize: '14px',
    paddingTop: '8px',
  },
  inputWithoutLabel: {
    height: '35px',
    marginTop: "0px !important",
    fontSize: '15px',
    paddingTop: '0px'
  },
  passwordInput: {
    marginLeft: '24px',
    marginRight: '24px',
  },
  passwordInputProp: {
    fontSize: '14px',
  },
  gridSubContainer: {
    borderRadius: '7px',
    paddingLeft: '12px',
    justifyContent: "space-between",
    margin: '4px',
    height: '40px',
  },
  greyBg: {
    backgroundColor: "#edf1f6",
  },
  inputLabelNoShrink: {
    transform: "translate(0px, 14px) scale(1)",
    top: '-10px',
  },
  inputLabelFocused: {
    top: '-4px',
  },
  inputLabelShrink: {
    transform: "translate(0px, 4px) scale(1)",
  },
  inputLabelDisappear: {
    display: "none",
  },
  loginButton: {
    height: '38px',
    fontSize: '15px',
    paddingLeft: '38px',
    paddingRight: '38px',
    margin: '0px',
    whiteSpace: 'nowrap',
    position: 'absolute',
    right: '0px',
    top: '-2px',
  },
  secureWordButton: {
    height: '30px',
    width: '70px',
    borderRadius: '15px',
    fontSize: '12px',
    marginRight: '24px',
    marginTop: '32px',
    lineHeight: '12px',
  },
  gridItem: {
    height: '40px',
    marginTop: '3px',
  },
  blueBox: {
    backgroundColor: "#0067b1",
    padding: '6px',
    width: '200px',
    height: '36px',
    borderRadius: '7px',
  },
  darkGreyText: {
    color: "#424b57",
    fontSize: '16px',
  },
  whiteText: {
    fontStyle: "italic",
    color: "#ffffff",
  },
  checkCircleIcon: {
    fontSize: '42px',
    marginRight: '8px',
    padding: '1px',
    borderRadius: '26px',
    boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
  },
  cancelIcon: {
    fontSize: '42px',
    color: "#424b57",
    marginLeft: '8px',
    padding: '1px',
    borderRadius: '26px',
    boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
  },
  outerBox: {
    width: '100%',
    position: 'relative',
  }
};

// SIT2 env file
const hmkKey = '5497B691458FC1CD31A16116701F57F8';

const Login = (props) => {
  const loginRef = useRef(null);
  const { width } = useDimensions(loginRef);
  const history = useHistory();

  const dispatch = useDispatch()
  const secretPhrase = useSelector(state => state.AUT.preLogin.getSecretPhrase.data?.secretPhrase);
  const userType = useSelector(state => state.AUT.preLogin.getSecretPhrase.data?.userType);
  const preLogin = retrieveData('Prelogin');

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
    if (isMicro()) {
      dispatch(init());
    }
  }, []);

  useEffect(() => {
    // TODO: handle usertype '0', no secretPhrase
    if (secretPhrase || userType) {
      setLoginPressed(true);
    } else {
      setLoginPressed(false);
    }
  }, [secretPhrase, userType]);

  const onGetSecretPhrase = (event) => {
    event.preventDefault();

    /* remove leading and trailing spaces */
    const usernameWithoutSpaces = username?.replace(/^\s+|\s+$/g, '');
    if (usernameWithoutSpaces.length >= 6) {
      dispatch(getSecretPhrase({
        username
      }))
    } else {
      // return error here
      console.error('Must be at least 6 chars')
    }
  }

  const onRedirect = (path) => () => {
    if (isMicro()) {
      alert('Login is successful!!');
    } else {
      history.push(path);
    }
  }

  const onFailedLogin = () => {
    if (!isMicro()) {
      alert('Login failed!!');
    }
  }

  const onLogin = (event) => {
    event.preventDefault();

    const coExistance = preLogin?.data?.appConfig?.find(
      item => item.parameter === 'coexistence.flag'
    )?.value;

    const pwParam = constructPWPadding(password, coExistance === 'TRUE');

    const zpkKey = preLogin?.data?.zmkZpkEncrypted;
    const decryptedZpkKey = decryptHsm(hmkKey, zpkKey);
    const keyedPassword1 = encryptDataHsm(decryptedZpkKey, pwParam[0]);
    const keyedPassword2 =
      pwParam.length > 1
        ? encryptDataHsm(decryptedZpkKey, pwParam[1])
        : null;
    const data = keyedPassword2
      ? {
          userId: username,
          keyedPassword1,
          keyedPassword2
        }
      : {
          userId: username,
          keyedPassword1
        };
    dispatch(login({ data, onSuccess: onRedirect('/dashboard'), onError: onFailedLogin }));
  }

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
          sx={loginPressed ? { ...styles.gridSubContainer, ...styles.greyBg } : { ...styles.gridSubContainer }}
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
                sx: loginPressed ? styles.inputLabelDisappear : focused || shrink ? styles.inputLabelFocused : styles.inputLabelNoShrink,
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
          sx={{ ...styles.mainContainer, ...styles.secureWordContainer, width: secureWordWidth }}
        >
          <Grid
            container
            style={{ justifyContent: "center", paddingTop: '24px' }}
          >
            <Grid item sx={styles.blueBox}>
              <Typography sx={styles.whiteText} align="center">
                strawberry
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "center",
              paddingTop: '16px',
              paddingBottom: '16px',
            }}
          >
            <Grid item>
              <Typography sx={styles.darkGreyText} align="center">
                Confirm this is your Secure Word?
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "center",
              paddingBottom: '20px',
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
                paddingBottom: '20px',
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
                onChange={event => setPassword(event.target.value)}
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
