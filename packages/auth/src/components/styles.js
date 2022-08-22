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
      width: '140px',
      height: '140px',
      borderRadius: '70px',
      overflow: 'hidden',
    },
    secureImage: {
      width: '140px',
      height: '140px',
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

  export default styles;
  