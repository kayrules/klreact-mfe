import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { defaultTheme, ThemeProvider } from "@klreact-mfe/mfe-ui";
import { Login, Landing } from './components';

export default ({ history }) => {
  return (
      <ThemeProvider theme={defaultTheme}>
        <Router history={history}>
          <Switch>
            <Route exact path="/auth/login" component={Login} />
            <Route path="/" component={Landing} />
          </Switch>
        </Router>
      </ThemeProvider>
  );
};
