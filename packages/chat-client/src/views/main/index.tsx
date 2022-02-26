import Chat from "./chat";
import Room from "./room";
import Sidebar from "./sidebar";

const Main = () => {
  return (
    <div className="bg-[url('~/assets/bg-1.jpg')] bg-no-repeat bg-cover w-screen h-screen flex justify-center items-center">
      <div className="w-4/5 h-4/5 backdrop-blur-[50px] shadow-2xl rounded overflow-hidden flex">
        <Sidebar />
        <Room />
        <Chat />
      </div>
    </div>
  );
};

export default Main;
