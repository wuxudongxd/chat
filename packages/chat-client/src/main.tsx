import "./index.css";
import "antd/dist/antd.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { ReactQueryProvider } from "./context/react-query";

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
