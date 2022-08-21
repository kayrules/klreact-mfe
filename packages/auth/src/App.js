import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { Provider } from 'react-redux'
import { defaultTheme, ThemeProvider } from "@klreact-mfe/mfe-ui";
import store from './redux/store'
import Login from './components/Login';
import ReduxTest from './components/ReduxTest';

export default ({ history }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Router history={history}>
          <Switch>
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/redux" component={ReduxTest} />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};
