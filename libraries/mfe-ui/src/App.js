import React from "react";
import { Switch, Route, Router } from "react-router-dom";
import Catalog from "./pages/Catalog";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "./themes";
import "./assets/css/style.css";

export default ({ history }) => {
  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <Router history={history}>
          <Switch>
            <Route path="/" component={Catalog} />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
};
