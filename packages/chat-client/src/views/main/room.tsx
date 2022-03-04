/* eslint-disable react/no-unstable-nested-components */
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Menu, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { useChatDispatch, useChatStore } from "~/context/chat-store";
import { useSocketIo } from "~/context/socket-io";
import { useCacheUser } from "~/hooks/api/useUser";

const Room = () => {
  const socket = useSocketIo();
  const user = useCacheUser();
  const { groups, groupId } = useChatStore();
  const [groupsData, setGroupData] = useState<GroupResponse[]>([]);

  useEffect(() => {
    setGroupData(groups);
  }, [groups]);

  const dispatch = useChatDispatch();

  const { Option } = Select;

  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [groupName, setGroupName] = useState("");

  const addGroup = () => {
    if (groupName) {
      setShowAddGroup(false);
      socket.emit("addGroup", { name: groupName, userId: user.id });
      setGroupName("");
    }
  };

  const handleSearch = (value: string) => {
    const mySearchData = [];
    for (const chat of groups) {
      if (chat.name.includes(value)) {
        mySearchData.push(chat);
      }
    }
    setGroupData(mySearchData);
  };


  const selectChat = () => {
    console.log("111");
  };

  const menu = (
    <Menu className="rounded">
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
      <div className="h-14 p-3 relative">
        <Select
          showSearch
          placeholder="搜索聊天组"
          showArrow={false}
          bordered={false}
          className="bg-white w-full rounded"
          onSearch={handleSearch}
        >
          {groupsData.map((group) => {
            return (
              <Option key={group.id} value={group.name} onClick={selectChat}>
                {group.name}
              </Option>
            );
          })}
        </Select>
        <Dropdown
          overlay={menu}
          placement="bottomCenter"
          className="absolute top-3 right-3 w-8 h-8 flex items-center rounded-r cursor-pointer hover:bg-blue-200"
        >
          <div className="flex justify-center items-center">
            <PlusCircleOutlined
              className="text-xl"
              style={{ color: "#747d8c" }}
            />
          </div>
        </Dropdown>
        <Modal
          title="搜索群聊"
          footer=""
          transitionName=""
          maskTransitionName=""
          visible={showAddGroup}
          onCancel={() => {
            setShowAddGroup(false);
          }}
        >
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
      <div className="flex-1 overflow-auto scrollbar-none">
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
