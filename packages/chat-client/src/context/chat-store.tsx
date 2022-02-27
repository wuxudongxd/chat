import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useCacheUser } from "~/hooks/api/useUser";

import { useSocketIo } from "./socket-io";

import type { Dispatch } from "react";

interface IState {
  groups: any[];
  groupId: number;
  friends: any[];
  friendId: number;
}

const defaultState: IState = {
  groups: [],
  groupId: -1,
  friends: [],
  friendId: -1,
};

function reducer(
  state = defaultState,
  action: { type: string; payload?: any }
): IState {
  switch (action.type) {
    case "DATA_INIT":
      return { ...state, ...action.payload };
    case "GROUP_UPDATE":
      return { ...state, groups: [action.payload, ...state.groups] };
    case "GROUP_ID_SET":
      return { ...state, groupId: action.payload };
    default:
      return state;
  }
}

const ChatStoreContext = createContext<IState>(defaultState);
const ChatDispatchContext = createContext<Dispatch<{
  type: string;
  payload?: any;
}> | null>(null);

export const ChatStoreProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const socket = useSocketIo();
  const user = useCacheUser();

  useEffect(() => {
    socket.on("connect", async () => {
      console.log("连接成功");
      socket.emit("chatData", user);
    });

    socket.on("chatData", (data: any) => {
      console.log("chatData", data);
      dispatch({ type: "DATA_INIT", payload: data });
      if (data.groups.length !== 0) {
        dispatch({ type: "GROUP_ID_SET", payload: data.groups[0].id });
      }
    });

    socket.on("addGroup", (data: any) => {
      console.log("addGroup", data);
      dispatch({ type: "GROUP_UPDATE", payload: data });
      dispatch({ type: "GROUP_ID_SET", payload: data.id });
    });

    socket.on("groupMessage", (data) => {
      console.log("groupMessage", data);
      if (data.id !== user.id) {
        dispatch({ type: "COUNTER_INC" });
      }
    });
  }, [socket, user]);

  return (
    <ChatStoreContext.Provider value={state}>
      <ChatDispatchContext.Provider value={dispatch}>
        {children}
      </ChatDispatchContext.Provider>
    </ChatStoreContext.Provider>
  );
};

export const useChatStore = () => useContext(ChatStoreContext);
export const useChatDispatch = () => {
  const dispatch = useContext(ChatDispatchContext);
  if (!dispatch) {
    throw new Error("useChatDispatch 必须在 ChatStoreProvider 中使用");
  }
  return dispatch;
};
