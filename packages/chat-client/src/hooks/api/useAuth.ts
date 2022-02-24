import { useQueryClient } from "react-query";
import { rmToken, setToken } from "~/utils/token-storage";

import { http } from "./useHttp";

import type { AuthResponse } from "Shared/types";

const useAuth = () => {
  const queryClient = useQueryClient();
  const authServer = async (
    urlEndpoint: string,
    username: string,
    password: string
  ): Promise<void> => {
    try {
      const data = await http<AuthResponse>(urlEndpoint, {
        data: { username, password },
        method: "POST",
      });
      queryClient.setQueryData("token", data.token); // react-query cache
      setToken(data.token); // localStorage store token
      queryClient.invalidateQueries("user"); // invalidate cache to refresh user
    } catch (error) {
      console.log("auth error:", error);
    }
  };

  async function signin(username: string, password: string): Promise<void> {
    authServer("signin", username, password);
  }
  async function signup(username: string, password: string): Promise<void> {
    authServer("signup", username, password);
  }

  function signout(): void {
    queryClient.setQueryData("token", null);
    queryClient.removeQueries(["token", "user"]);
    rmToken();
  }

  return {
    signin,
    signup,
    signout,
  };
};

export default useAuth;
