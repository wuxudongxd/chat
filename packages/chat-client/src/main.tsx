import "./index.css";
import "antd/dist/antd.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { ReactQueryProvider } from "./context/react-query";
import { SocketIoProvider } from "./context/socket-io";

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryProvider>
      <SocketIoProvider>
        <App />
      </SocketIoProvider>
    </ReactQueryProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
