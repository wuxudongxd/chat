import { useHttp } from "./useHttp";

const useGroup = () => {
  const http = useHttp();

  const restSearchGroup = async (groupName: string) => {
    const response = await http<RESPONSE<Group[]>>("group/findByName", {
      data: { groupName },
    });
    if (response.code !== "ok") {
      throw new Error(response.msg);
    }
    return response.data;
  };

  return {
    restSearchGroup,
  };
};

export default useGroup;
