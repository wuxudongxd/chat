import { useEffect } from "react";
import { useChatDispatch } from "~/context/chat-store";
import { useSocketIo } from "~/context/socket-io";
import { useCacheUser } from "~/hooks/api/useUser";

const useSocketWatch = () => {
  const socket = useSocketIo();
  const user = useCacheUser();
  const dispatch = useChatDispatch();

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
      dispatch({ type: "GROUPS_UPDATE", payload: data });
      dispatch({ type: "GROUP_ID_SET", payload: data.id });
    });

    socket.on("groupMessage", (data: Group_Message) => {
      console.log("groupMessage", data);
      // if (data.id !== user.id) {
        dispatch({ type: "GROUP_MSG_UPDATE", payload: data });
      // }
    });

    socket.on("joinGroup", (data: Group) => {
      console.log("joinGroup", data);
      dispatch({ type: "GROUPS_UPDATE", payload: data });
    });
  }, [dispatch, socket, user]);
};

export default useSocketWatch;
