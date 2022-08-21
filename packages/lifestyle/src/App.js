import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { defaultTheme, ThemeProvider } from "@klreact-mfe/mfe-ui";
import { Provider } from 'react-redux'
import store from './redux/store'

import Landing from './components/Landing';
import Explore from './components/Explore';
import HomeCarousel from './components/HomeCarousel';
import ReduxTest from './components/ReduxTest';

export default ({ history }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Router history={history}>
          <Switch>
            <Route path="/lifestyle/carousel" component={HomeCarousel} />
            <Route exact path="/lifestyle/explore" component={Explore} />
            <Route exact path="/lifestyle/redux" component={ReduxTest} />
            <Route path="/lifestyle" component={Landing} />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};
