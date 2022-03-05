import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Menu, Modal, Select } from "antd";
import { useMemo, useState } from "react";
import useGroup from "~/hooks/api/useGroup";
import useSocketEmit from "~/hooks/socket/useSocketEmit";

const Option = () => {
  const { socketCreateGroup, socketJoinGroup } = useSocketEmit();
  const { restSearchGroup } = useGroup();
  const { Option } = Select;

  // different Modal state
  type actions = "addGroup" | "joinGroup" | "addFriend" | "";
  const [showState, setShowState] = useState<actions>("");

  // addGroup state
  const [content, setContent] = useState("");
  const addGroup = () => {
    if (content) {
      setShowState("");
      socketCreateGroup(content);
      setContent("");
    }
  };

  // joinGroup state
  const [groupsData, setGroupData] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState(-1);
  const searchGroup = async (value: string) => {
    if (value) {
      const groups = await restSearchGroup(value);
      setGroupData(groups)
    }
  };
  const joinGroup = () => {
    socketJoinGroup(groupId);
  };

  const menu = useMemo(() => {
    const menuActions: { name: string; action: actions }[] = [
      { name: "新建群", action: "addGroup" },
      { name: "加入群", action: "joinGroup" },
      { name: "添加好友", action: "addFriend" },
    ];
    return (
      <Menu className="rounded">
        {menuActions.map((item, index) => (
          <Menu.Item key={index}>
            <div
              onClick={() => {
                setShowState(item.action);
              }}
            >
              {item.name}
            </div>
          </Menu.Item>
        ))}
      </Menu>
    );
  }, []);

  return (
    <>
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
        title="新建群聊"
        footer=""
        transitionName=""
        maskTransitionName=""
        visible={showState === "addGroup"}
        onCancel={() => {
          setShowState("");
        }}
      >
        <div className="flex">
          <Input
            value={content}
            onInput={(e) => {
              e.preventDefault();
              setContent((e.target as HTMLInputElement).value);
            }}
          />
          <Button onClick={addGroup}>确定</Button>
        </div>
      </Modal>
      <Modal
        title="搜索群聊"
        footer=""
        transitionName=""
        maskTransitionName=""
        visible={showState === "joinGroup"}
        onCancel={() => {
          setShowState("");
        }}
      >
        <div className="flex">
          <Select
            showSearch
            placeholder="搜索群聊"
            showArrow={false}
            className="bg-white w-full rounded"
            onSearch={searchGroup}
            onSelect={(id: number) => {
              setGroupId(id);
            }}
          >
            {groupsData.map((group) => {
              return (
                <Option key={group.id} value={group.id}>
                  {group.name}
                </Option>
              );
            })}
          </Select>
          <Button onClick={joinGroup}>加入</Button>
        </div>
      </Modal>
    </>
  );
};

export default Option;
