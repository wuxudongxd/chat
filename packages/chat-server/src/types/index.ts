export interface RESPONSE<T> {
  code: 'ok' | 'fail' | 'error';
  msg: string;
  data: T;
}

export type User = {
  id: number;
  username: string;
  avatar: string;
  tag: string;
  createTime: Date;
  role: string;
};

export interface AuthResponse {
  user: User;
  token: string;
}
