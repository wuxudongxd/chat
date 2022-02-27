import { createContext, PropsWithChildren, useContext } from "react";
import { io } from "socket.io-client";
import { useCacheUser } from "~/hooks/api/useUser";

import type { Socket } from "socket.io-client";

const SocketIoContext = createContext<Socket | undefined>(undefined);
SocketIoContext.displayName = "SocketIoContext";

export const SocketIoProvider = ({ children }: PropsWithChildren<{}>) => {
  const user = useCacheUser();
  const socket = io(`http://localhost:3001?userId=${user.id}`);
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
