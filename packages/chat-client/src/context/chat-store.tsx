import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useQueryClient } from "react-query";

import { useSocketIo } from "./socket-io";

const defaultState = {
  counter: 0,
  groups: [] as any,
  groupId: -1,
  friends: [] as any,
  friendId: -1,
};

function reducer(state = defaultState, action: any) {
  switch (action.type) {
    case "DATA_INIT":
      return { ...state, ...action.payload };
    case "GROUP_UPDATE":
      return { ...state, groups: [action.payload, ...state.groups] };
    case "GROUP_ID_SET":
      return { ...state, groupId: action.payload };
    case "COUNTER_INC":
      return { ...state, counter: state.counter + 1 };
    case "COUNTER_DEC":
      return { ...state, counter: state.counter - 1 };
    case "COUNTER_RESET":
      return { ...state, counter: 0 };
    default:
      return state;
  }
}

const ChatStoreContext = createContext<any | null>(null);
const ChatDispatchContext = createContext<any | null>(null);

export const ChatStoreProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const socket = useSocketIo();
  const queryClient = useQueryClient();
  const { data: user } = queryClient.getQueryData("user") as { data: any };

  useEffect(() => {
    // socket.on("connect", async () => {
    //   console.log("连接成功");
    socket.emit("chatData", user);
    // });

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
export const useChatDispatch = () => useContext(ChatDispatchContext);
