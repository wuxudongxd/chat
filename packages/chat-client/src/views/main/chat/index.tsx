import { Button } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "~/context/chat-store";
import { useSocketIo } from "~/context/socket-io";
import { useCacheUser } from "~/hooks/api/useUser";

import Message from "./message";

const Chat = () => {
  const socket = useSocketIo();
  const user = useCacheUser();
  const { groupId, groups } = useChatStore();

  const [content, setContent] = useState("");

  const curGroup = useMemo(
    () => groups.find((item) => item.id === groupId),
    [groupId, groups]
  );

  const handleEmit = (e: any) => {
    e.preventDefault();
    socket.volatile.emit("groupMessage", { content, userId: user.id, groupId });
    setContent("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-14 w-full flex justify-center items-center bg-black/50">
        <span className="text-lg text-gray-300">
          {curGroup?.name || "none"}
        </span>
      </div>
      {curGroup && <Message group={curGroup} />}
      <div className="w-full h-10 flex justify-between items-center">
        <div className="h-full w-10 px-7 cursor-pointer bg-white rounded-l flex justify-center items-center text-lg">
          😃
        </div>
        <input
          className="w-full h-full outline-0"
          type="text"
          placeholder="输入消息"
          value={content}
          onInput={(e) => setContent((e.target as HTMLInputElement).value)}
        />
        <Button
          type="primary"
          size="large"
          className="h-full"
          onClick={handleEmit}
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export default Chat;
