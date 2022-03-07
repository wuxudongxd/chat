import { Button, Popover } from "antd";
import { useState } from "react";
import FileUpload from "~/components/fileUpload";
import { useChatStore } from "~/context/chat-store";
import useSocketEmit from "~/hooks/socket/useSocketEmit";

import Emoji from "./emoji";

const MessageInput = () => {
  const { groupId } = useChatStore();
  const { socketGroupMessage } = useSocketEmit();

  const [content, setContent] = useState("");
  const handleEmit = (e: any) => {
    e.preventDefault();
    socketGroupMessage({ content, groupId, messageType: "text" });
    setContent("");
  };

  const updateFile = (file: File) => {
    console.log("updateFile", file);
    
    socketGroupMessage({ content: file, groupId, messageType: "image" });
  };

  const [toolSelect, setToolSelect] = useState<"emoji" | "image">("emoji");
  const tools = (
    <div className="w-64 h-72">
      <div className="text-lg font-medium pb-2 mb-3 border-b border-gray-300">
        <span
          className={`${
            toolSelect === "emoji" ? "text-blue-800" : ""
          } ml-1 mr-4 cursor-pointer transition-all`}
          onClick={() => setToolSelect("emoji")}
        >
          表情
        </span>
        <span
          className={`${
            toolSelect === "image" ? "text-blue-800" : ""
          } cursor-pointer`}
          onClick={() => setToolSelect("image")}
        >
          图片
        </span>
      </div>
      {toolSelect === "emoji" ? <Emoji setContent={setContent} /> : null}
      {toolSelect === "image" ? <FileUpload updateFile={updateFile} /> : null}
    </div>
  );

  return (
    <div className="w-full h-10 flex justify-between items-center">
      <div className="h-full w-10 px-7 cursor-pointer bg-white rounded-l flex justify-center items-center text-lg">
        <Popover content={tools} trigger="click">
          <span className="select-none">😃</span>
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
