import React, { useRef } from "react";
import { ReduxTest as AuthReduxTest } from "auth/components";
import { ReduxTest as LifestyleReduxTest } from "lifestyle/components";

const ReduxPage = () => (
  <React.Fragment>
    <AuthReduxTest />
    <LifestyleReduxTest />
  </React.Fragment>
);

export default ReduxPage;
