import { useQuery, useQueryClient } from "react-query";
import { getToken } from "~/utils/token-storage";

import { http } from "./useHttp";

const useUser = () => {
  const queryClient = useQueryClient();
  const userQuery = useQuery(
    "user",
    async () => {
      const token = getToken();
      if (!token) return null;
      const response = await http<RESPONSE<User>>("user", { token });
      if (response.code !== "ok") {
        throw new Error(response.msg);
      }
      queryClient.setQueryData("token", token);
      return response.data;
    },
    {
      retry: 0,
    }
  );
  return {
    userQuery,
  };
};

export const useCacheUser = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData("user") as User;
};

export default useUser;
