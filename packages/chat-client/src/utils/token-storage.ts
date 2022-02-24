const AUTH_TOKEN = "__auth_token__";

export const getToken = () => localStorage.getItem(AUTH_TOKEN) || null;

export const setToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN, token || "");
  return token;
};
export const rmToken = async () => localStorage.removeItem(AUTH_TOKEN);
