import { Button } from "antd";
import { useEffect, useState } from "react";
import { useSocketIo } from "~/context/socket-io";

const Main = () => {
  const socket = useSocketIo();
  const [input, setInput] = useState("");
  const [content, setContent] = useState<string[]>([]);

  const handleEmit = (e: any) => {
    e.preventDefault();
    socket.volatile.emit("message", input);
    setContent((prev) => [...prev, input]);
    setInput("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      socket.on("message", (msg: string) => {
        console.log("socket id: ", socket.id);
        console.log("received:", msg);
        setContent((prev) => [...prev, msg]);
      });
    });
  }, []);

  return (
    <div className="bg-[url('~/assets/bg-1.jpg')] bg-no-repeat bg-cover w-screen h-screen flex justify-center items-center">
      <div className="w-4/5 h-4/5 backdrop-blur-[50px] shadow-2xl rounded overflow-hidden flex flex-col">
        <div className="h-10 w-full flex justify-center items-center bg-black/50">
          <span className="text-lg text-gray-300">默认聊天室</span>
        </div>
        <div className="flex-1">
          {content.map((item: string, index: number) => {
            return <div key={index}>{item}</div>;
          })}
        </div>
        <div className="w-full h-8 flex justify-between items-center">
          <input
            className="w-full h-full px-4 outline-0"
            type="text"
            placeholder="输入消息"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          />
          <Button type="primary" className="h-full" onClick={handleEmit}>
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Main;
