import React from "react";

const Card = (props) => {
  return <div style={{ borderRadius: 20, overflow: 'hidden' }}>{props.children}</div>;
};

export { Card };
