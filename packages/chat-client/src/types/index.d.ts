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

interface Group {
  id: number;
  name: string;
  notice: string;
  createTime: Date;
}

interface Group_Message {
  id: number;
  content: string;
  createTime: Date;
  userId: number;
  groupId: number;
}

type GroupWithInfo = Group & { messages: Group_Message[] } & {
  users: User[];
};
interface AuthResponse {
  user: User;
  token: string;
}
