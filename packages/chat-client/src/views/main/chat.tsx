import { Button } from "antd";
import { useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { useChatStore } from "~/context/chat-store";
import { useSocketIo } from "~/context/socket-io";

const Chat = () => {
  const socket = useSocketIo();
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { data: user } = queryClient.getQueryData("user") as { data: any };
  const { groupId, groups } = useChatStore() as {
    groups: any[];
    [key: string]: any;
  };
  const ChatName = useMemo(() => {
    const curGroup = groups.find((item) => item.id === groupId);
    return curGroup?.name || "none";
  }, [groupId, groups]);

  const handleEmit = (e: any) => {
    e.preventDefault();
    socket.volatile.emit("groupMessage", { content, userId: user.id, groupId });
    setMessages((prev) => [...prev, content]);
    setContent("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-14 w-full flex justify-center items-center bg-black/50">
        <span className="text-lg text-gray-300">{ChatName}</span>
      </div>
      <div className="flex-1">
        {messages.map((item: string, index: number) => {
          return <div key={index}>{item}</div>;
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
