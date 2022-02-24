export type User = {
  id: number;
  username: string;
  password: string;
  avatar: string;
  tag: string;
  createTime: Date;
  role: string;
};

export interface AuthResponse {
  user: User;
  token: string;
}
