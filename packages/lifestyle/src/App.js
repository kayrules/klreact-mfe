import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { defaultTheme, ThemeProvider } from "@klreact-mfe/mfe-ui";
import { Provider } from 'react-redux'
import store from './redux/store'
import { Landing, Explore, JustForYou, HomeCarousel } from './components';
import ReduxTest from './components/ReduxTest';

export default ({ history }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Router history={history}>
          <Switch>
            <Route exact path="/lifestyle/carousel" component={HomeCarousel} />
            <Route exact path="/lifestyle/explore" component={Explore} />
            <Route exact path="/lifestyle/promo" component={JustForYou} />
            <Route exact path="/lifestyle/redux" component={ReduxTest} />
            <Route path="/" component={Landing} />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};
