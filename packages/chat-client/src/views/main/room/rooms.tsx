import { useChatDispatch, useChatStore } from "~/context/chat-store";

const Rooms = () => {
  const { groups, groupId } = useChatStore();
  const dispatch = useChatDispatch();

  return (
    <div className="flex-1 overflow-auto scrollbar-none select-none">
      {groups?.map((item, index) => {
        return (
          <div
            key={index}
            className={`h-16 ${
              groupId === item.id ? "bg-black/40" : "bg-black/20"
            }  flex items-center cursor-pointer hover:bg-black/30 transition-all`}
            onClick={() => {
              dispatch({ type: "GROUP_ID_SET", payload: item.id });
            }}
          >
            <img
              className="w-8 h-8 ml-4 rounded-full"
              src="https://gravatar.com/avatar/placeholder?s=200"
              alt="avatar"
            />
            <div className="ml-4 flex-1 flex flex-col justify-center text-gray-300">
              <div className="text-base">{item.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Rooms;
