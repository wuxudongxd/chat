import dayjs from "dayjs";
import { useRef, useEffect } from "react";
import { useCacheUser } from "~/hooks/api/useUser";

const Message = ({ group }: { group: GroupResponse }) => {
  const { id: userId } = useCacheUser();

  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messageListRef.current) throw Error("messageListRef is not assigned");
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [group]);

  return (
    <div
      ref={messageListRef}
      className="flex-1 overflow-auto scrollbar-none mr-4"
    >
      {group.messages.map((message: Group_Message) => {
        const speakUser = group.users.find(
          (user) => user.id === message.userId
        );
        return (
          <div
            key={message.id}
            className={`${
              message.userId === userId ? "text-right" : ""
            } text-lg text-gray-200 min-h-[4rem] mt-3 mb-6`}
          >
            <div className="flex justify-end items-center">
              <img
                className="w-6 h-6 rounded-full mr-2"
                src={speakUser?.avatar}
                alt="avatar"
              />
              <div className="mr-2 font-medium text-base">
                {speakUser?.username || "none"}
              </div>
              <div className="text-xs">
                {dayjs(message.createTime).format("MM/DD HH:mm")}
              </div>
            </div>
            <div className="bg-black/30 inline-block max-w-lg text-left mt-2 ml-4 p-2 text-base break-words rounded-md">
              {message.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Message;
