import { Button } from "antd";
import { useEffect } from "react";
import { useSocketIo } from "~/context/socket-io";

const Main = () => {
  const socket = useSocketIo();

  const handleEmit = (e: any) => {
    e.preventDefault();
    socket.volatile.emit("message", {
      message: "Hello world",
    });
  };

  useEffect(() => {
    socket.on("connect", () => {
      // socket.volatile.emit("message", "client message");
      socket.on("message", (msg: string) => {
        console.log("received:", msg);
      });
    });
  }, []);

  return (
    <div>
      <div className="bg-[url('~/assets/bg-1.jpg')] bg-no-repeat bg-cover w-screen h-screen flex justify-center items-center">
        <div className="w-4/5 h-4/5 backdrop-blur-[150px] relative shadow-2xl rounded overflow-hidden">
          <div className="absolute top-0 h-8 w-full flex justify-center items-center bg-slate-500">
            <span className="text-lg">默认聊天室</span>
          </div>
          <div className="absolute bottom-0 w-full h-8 flex justify-between items-center">
            <input
              className="w-full h-full px-4 outline-0"
              type="text"
              placeholder="输入消息"
            />
            <Button type="primary" className="h-full" onClick={handleEmit}>
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
