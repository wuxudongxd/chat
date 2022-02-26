import {
  BulbOutlined,
  GithubOutlined,
  PoweroffOutlined,
  SkinOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";

const Sidebar = () => {
  return (
    <div className="w-20 bg-black/50 flex flex-col justify-between items-center py-4 text-gray-300 text-lg overflow-hidden">
      <div className="flex flex-col items-center">
        <img
          className="w-12 rounded-full"
          src="https://gravatar.com/avatar/placeholder?s=200"
          alt="avatar"
        />
        <div className="mt-2">name</div>
      </div>
      <div className="h-52 mb-2 flex flex-col items-center justify-between">
        <Tooltip placement="topLeft" arrowPointAtCenter title="请文明聊天">
          <BulbOutlined className="text-2xl" />
        </Tooltip>
        <SkinOutlined className="text-2xl" />
        <a href="https://github.com/wuxudongxd/chat" className="text-gray-300">
          <GithubOutlined className="text-2xl" />
        </a>
        <PoweroffOutlined className="text-2xl" />
      </div>
    </div>
  );
};

export default Sidebar;
