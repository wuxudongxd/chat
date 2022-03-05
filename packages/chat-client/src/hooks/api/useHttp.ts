import qs from "qs";
import { useQueryClient } from "react-query";

const apiUrl = "http://localhost:3001";

interface Options extends RequestInit {
  token?: string;
  data?: object;
}

export const http = async <T>(
  endpoint: string,
  { data, token, headers, ...customConfig }: Options = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  // axios 和 fetch 的表现不一样，axios可以直接在返回状态不为2xx的时候抛出异常
  return fetch(`${apiUrl}/${endpoint}`, config).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
};

export const useHttp = () => {
  const queryClient = useQueryClient();
  const token = queryClient.getQueryData("token") as string;
  
  return <T>(...[endpoint, config]: Parameters<typeof http>) =>
    http<T>(endpoint, { ...config, token });
};
