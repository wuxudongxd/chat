import { useSocketIo } from "~/context/socket-io";
import { useCacheUser } from "~/hooks/api/useUser";

const useSocketEmit = () => {
  const socket = useSocketIo();
  const user = useCacheUser();

  const socketCreateGroup = async (groupName: string) => {
    socket.emit("addGroup", { name: groupName, userId: user.id });
  };

  const socketJoinGroup = async (groupId: number) => {
    socket.emit("joinGroup", { groupId, userId: user.id });
  };

  const socketGroupMessage = async (content: string, groupId: number) => {
    socket.emit("groupMessage", { content, userId: user.id, groupId });
  };

  return { socketCreateGroup, socketJoinGroup, socketGroupMessage };
};

export default useSocketEmit;
