import { PlusCircleOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Select } from "antd";

const Chat = () => {
  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="w-56 bg-black/20 flex flex-col">
      <div className="h-14 p-3 flex items-center">
        <Select
          showSearch
          placeholder="搜索聊天组"
          className="w-full rounded-l"
        />
        <Dropdown overlay={menu} placement="bottomCenter">
          <div className="bg-white w-10 h-full rounded-r flex justify-center items-center">
            <PlusCircleOutlined
              className="text-2xl"
              style={{ color: "#747d8c" }}
            />
          </div>
        </Dropdown>
      </div>
      <div className="flex-1 overflow-auto">
        {[...new Array(5)].map(() => {
          return (
            <div className="h-16 bg-black/25 flex items-center cursor-pointer">
              <img
                className="w-8 h-8 ml-4 rounded-full"
                src="https://gravatar.com/avatar/placeholder?s=200"
                alt="avatar"
              />
              <div className="ml-4 flex-1 flex flex-col justify-center text-gray-300">
                <div className="text-base">name</div>
                <div className="text-gray-400">message</div>
              </div>
            </div>
          );
        })}
        <div className="h-16 bg-black/40 ">chat</div>
      </div>
    </div>
  );
};

export default Chat;
