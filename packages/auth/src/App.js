import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { defaultTheme, ThemeProvider } from "@klreact-mfe/mfe-ui";
import Login from './components/Login';

export default ({ history }) => {
  return (
      <ThemeProvider theme={defaultTheme}>
        <Router history={history}>
          <Switch>
            <Route path="/auth/login" component={Login} />
          </Switch>
        </Router>
      </ThemeProvider>
  );
};
