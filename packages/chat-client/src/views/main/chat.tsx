import { Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useChatStore } from "~/context/chat-store";
import { useSocketIo } from "~/context/socket-io";
import { useCacheUser } from "~/hooks/api/useUser";

const Chat = () => {
  const socket = useSocketIo();
  const user = useCacheUser();
  const { groupId, groups } = useChatStore();

  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<Group_Message[]>([]);

  const curGroup = useMemo(
    () => groups.find((item) => item.id === groupId),
    [groupId, groups]
  );

  useEffect(() => {
    curGroup && setMessages(curGroup.messages);
  }, [curGroup]);

  const handleEmit = (e: any) => {
    e.preventDefault();
    socket.volatile.emit("groupMessage", { content, userId: user.id, groupId });
    // setMessages((prev) => [...prev, content]);
    setContent("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-14 w-full flex justify-center items-center bg-black/50">
        <span className="text-lg text-gray-300">
          {curGroup?.name || "none"}
        </span>
      </div>
      <div className="flex-1">
        {messages.map((item: Group_Message, index: number) => {
          return (
            <div className="text-lg text-gray-300" key={index}>
              {item.userId} {item.content}
            </div>
          );
        })}
      </div>
      <div className="w-full h-10 flex justify-between items-center">
        <input
          className="w-full h-full px-4 outline-0"
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
