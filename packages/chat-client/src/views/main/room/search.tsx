import { Select } from "antd";
import { useEffect, useState } from "react";
import { useChatDispatch, useChatStore } from "~/context/chat-store";

const Search = () => {
  const { groups } = useChatStore();
  const [groupsData, setGroupData] = useState<GroupWithInfo[]>([]);
  const dispatch = useChatDispatch();

  const { Option } = Select;

  useEffect(() => {
    setGroupData(groups);
  }, [groups]);

  const handleSearch = (value: string) => {
    const mySearchData = [];
    for (const chat of groups) {
      if (chat.name.includes(value)) {
        mySearchData.push(chat);
      }
    }
    setGroupData(mySearchData);
  };

  const selectChat = (id: number) => {
    dispatch({ type: "GROUP_ID_SET", payload: id });
  };

  return (
    <Select
      showSearch
      placeholder="搜索聊天组"
      showArrow={false}
      bordered={false}
      className="bg-white w-full rounded"
      onSearch={handleSearch}
      onSelect={selectChat}
    >
      {groupsData.map((group) => {
        return (
          <Option key={group.id} value={group.id}>
            {group.name}
          </Option>
        );
      })}
    </Select>
  );
};

export default Search;
