interface AuthForm {
  username: string;
  password: string;
}

interface RESPONSE<T> {
  code: "ok" | "fail" | "error";
  msg: string;
  data: T;
}

interface User {
  id: number;
  username: string;
  avatar: string;
  tag: string;
  createTime: Date;
  role: string;
}

interface AuthResponse {
  user: User;
  token: string;
}
