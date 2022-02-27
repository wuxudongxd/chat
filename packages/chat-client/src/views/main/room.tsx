/* eslint-disable react/no-unstable-nested-components */
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Menu, Modal, Select } from "antd";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useChatDispatch, useChatStore } from "~/context/chat-store";
import { useSocketIo } from "~/context/socket-io";

const Room = () => {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [groupName, setGroupName] = useState("");

  const socket = useSocketIo();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData("user") as { data: any };
  const { groups, groupId } = useChatStore() as {
    groups: any[];
    [key: string]: any;
  };
  const dispatch = useChatDispatch();

  const addGroup = () => {
    setShowAddGroup(false);
    socket.emit("addGroup", { name: groupName, userId: user.data.id });
    setGroupName("");
  };

  const menu = (
    <Menu>
      <Menu.Item key={1}>
        <div
          onClick={() => {
            setShowAddGroup(true);
          }}
        >
          新建群聊
        </div>
      </Menu.Item>
      <Menu.Item key={2}>
        <div>搜索群聊</div>
      </Menu.Item>
      <Menu.Item key={3}>
        <div>搜索用户</div>
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
        <Modal title="搜索群聊" footer="" visible={showAddGroup}>
          <div className="flex">
            <Input
              value={groupName}
              onInput={(e) => {
                e.preventDefault();
                setGroupName((e.target as HTMLInputElement).value);
              }}
            />
            <Button onClick={addGroup}>确定</Button>
          </div>
        </Modal>
      </div>

      {/* items */}
      <div className="flex-1 overflow-auto">
        {groups?.map((item, index) => {
          return (
            <div
              key={index}
              className={`h-16 ${
                groupId === item.id ? "bg-black/40" : "bg-black/25"
              }  flex items-center cursor-pointer`}
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
                <div className="text-gray-400">{item.id}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Room;
