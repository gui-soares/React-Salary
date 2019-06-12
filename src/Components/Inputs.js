import React from "react";

export const Inputs = props => (
  <input
    readOnly={props.readOnly}
    type={!!props.isCurrency ? "text" : "number"}
    onInput={props.onInputChange}
    value={props.inputValue}
    onChange={event => event}
  />
);
