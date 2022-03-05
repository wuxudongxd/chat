import { createContext, PropsWithChildren, useContext, useReducer } from "react";

import type { Dispatch } from "react";

interface IState {
  groups: GroupWithInfo[];
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
    case "GROUPS_UPDATE":
      return { ...state, groups: [action.payload, ...state.groups] };
    case "GROUP_ID_SET":
      return { ...state, groupId: action.payload };
    case "GROUP_MSG_UPDATE":
      return {
        ...state,
        groups: state.groups.map((item) => {
          if (item.id === state.groupId) {
            return { ...item, messages: [...item.messages, action.payload] };
          }
          return item;
        }),
      };
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
