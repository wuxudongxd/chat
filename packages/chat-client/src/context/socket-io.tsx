import { createContext, PropsWithChildren, useContext } from "react";
import { io } from "socket.io-client";

import type { Socket } from "socket.io-client";

const socket = io("ws://localhost:3001");
// const socket = io();

const SocketIoContext = createContext<Socket | undefined>(undefined);
SocketIoContext.displayName = "SocketIoContext";

export const SocketIoProvider = ({ children }: PropsWithChildren<{}>) => {
  return (
    <SocketIoContext.Provider value={socket}>
      {children}
    </SocketIoContext.Provider>
  );
};

export const useSocketIo = () => {
  const context = useContext(SocketIoContext);
  if (!context) {
    throw new Error("SocketIoContext 必须在 SocketIoProvider 中使用");
  }
  return context;
};
