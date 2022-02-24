import { useQuery } from "react-query";
import { getToken } from "~/utils/token-storage";

import { http } from "./useHttp";

import type { User } from "Shared/types";

const useUser = () => {
  const userQuery = useQuery(
    "user",
    async () => {
      const token = getToken();
      if (!token) return null;
      return await http<User>("user", { token });
    },
    {
      retry: 0,
    }
  );
  return {
    userQuery,
  };
};

export default useUser;
