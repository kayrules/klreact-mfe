import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { defaultTheme, ThemeProvider, CssBaseline } from "@klreact-mfe/mfe-ui";
import { Provider } from 'react-redux'
import store from './redux/store'
import Progress from "./components/Progress";

const LifestyleLazy = lazy(() => import("./components/LifestyleApp"));
const AuthLazy = lazy(() => import("./components/AuthApp"));
const DashboardLazy = lazy(() => import("./pages/Dashboard"));
const MainPage = lazy(() => import("./pages/MainPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default () => {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route exact path="/" component={MainPage} />
              <Route path="/auth" component={AuthLazy} />
              <Route path="/dashboard" component={DashboardLazy} />
              <Route path="/lifestyle" component={LifestyleLazy} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};
