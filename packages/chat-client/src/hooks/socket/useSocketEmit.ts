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

  return { socketCreateGroup, socketJoinGroup };
};

export default useSocketEmit;
