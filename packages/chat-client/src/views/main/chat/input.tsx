import { Button, Popover } from "antd";
import { useState } from "react";
import { useChatStore } from "~/context/chat-store";
import useSocketEmit from "~/hooks/socket/useSocketEmit";

import Emoji from "./emoji";

const MessageInput = () => {
  const { groupId } = useChatStore();
  const { socketGroupMessage } = useSocketEmit();

  const [content, setContent] = useState("");
  const handleEmit = (e: any) => {
    e.preventDefault();
    socketGroupMessage(content, groupId);
    setContent("");
  };

  const tools = (
    <div>
      <Emoji setContent={setContent} />
    </div>
  );

  return (
    <div className="w-full h-10 flex justify-between items-center">
      <div className="h-full w-10 px-7 cursor-pointer bg-white rounded-l flex justify-center items-center text-lg">
        <Popover content={tools} trigger="click">
          😃
        </Popover>
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
  );
};

export default MessageInput;
