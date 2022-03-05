import Rooms from "./rooms";
import Search from "./search";
import Option from "./option";

const Room = () => {
  return (
    <div className="w-56 bg-black/10 flex flex-col">
      <div className="h-14 p-3 relative">
        <Search />
        <Option />
      </div>
      <Rooms />
    </div>
  );
};

export default Room;
