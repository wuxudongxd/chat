import { useMemo } from "react";
import { useChatStore } from "~/context/chat-store";

import MessageInput from "./input";
import Message from "./message";

const Chat = () => {
  const { groupId, groups } = useChatStore();
  
  const curGroup = useMemo(
    () => groups.find((item) => item.id === groupId),
    [groupId, groups]
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-14 w-full flex justify-center items-center bg-black/50">
        <span className="text-lg text-gray-300 select-none">
          {curGroup?.name || "none"}
        </span>
      </div>
      {curGroup && <Message group={curGroup} />}
      <MessageInput />
    </div>
  );
};

export default Chat;
