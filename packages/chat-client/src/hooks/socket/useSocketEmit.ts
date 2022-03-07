import { useSocketIo } from "~/context/socket-io";
import { useCacheUser } from "~/hooks/api/useUser";

interface GroupMessageProps {
  content: string | File;
  groupId: number;
  messageType: "text" | "image";
}

const useSocketEmit = () => {
  const socket = useSocketIo();
  const user = useCacheUser();

  const socketCreateGroup = async (groupName: string) => {
    socket.emit("addGroup", { name: groupName, userId: user.id });
  };

  const socketJoinGroup = async (groupId: number) => {
    socket.emit("joinGroup", { groupId, userId: user.id });
  };

  const socketGroupMessage = async ({
    content,
    groupId,
    messageType,
  }: GroupMessageProps) => {
    socket.emit("groupMessage", {
      content,
      userId: user.id,
      groupId,
      messageType,
    });
  };

  return { socketCreateGroup, socketJoinGroup, socketGroupMessage };
};

export default useSocketEmit;
