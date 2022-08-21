import { createTheme } from "@mui/material/styles";

const defaultTheme = createTheme({
  typography: {
    fontFamily: "Lato",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightBold: 700,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 578,
      md: 972,
      lg: 1196,
      xl: 1425,
    },
    unit: "px",
  },
});

export { defaultTheme };
