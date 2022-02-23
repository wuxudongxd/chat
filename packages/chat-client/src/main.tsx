import "./index.css";
import "antd/dist/antd.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { ReactQuery } from "./hooks/useReactQuery";

ReactDOM.render(
  <React.StrictMode>
    <ReactQuery>
      <App />
    </ReactQuery>
  </React.StrictMode>,
  document.getElementById("root")
);
