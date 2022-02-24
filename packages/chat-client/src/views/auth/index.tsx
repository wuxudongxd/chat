import { Form, Input, Button, Checkbox } from "antd";
import { useState } from "react";
import useAuth from "~/hooks/api/useAuth";

interface FromValues {
  username: string;
  password: string;
  password2?: string;
}

const Auth = () => {
  const [authState, setAuthState] = useState<"signin" | "signup">("signin");
  const { signin, signup } = useAuth();

  const onFinish = (values: FromValues) => {
    const { username, password, password2 } = values;
    if (authState === "signup" && password !== password2) {
      throw new Error("两次输入的密码不一致");
    }
    if (authState === "signin") {
      signin(username, password);
    } else if (authState === "signup") {
      signup(username, password);
    }
    console.log("Success:", values);
  };
  return (
    <div className="flex justify-center items-center flex-col w-screen h-screen">
      <div className="mb-5 space-x-5 text-lg">
        <span
          className={`cursor-pointer ${
            authState === "signin" ? "text-blue-500" : ""
          }`}
          onClick={() => setAuthState("signin")}
        >
          登录
        </span>
        <span
          className={`cursor-pointer ${
            authState === "signup" ? "text-blue-500" : ""
          }`}
          onClick={() => setAuthState("signup")}
        >
          注册
        </span>
      </div>
      <Form
        className="w-[28rem]"
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        {authState === "signup" && (
          <Form.Item
            label="确认密码"
            name="password2"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Auth;
