import { Form, Input, Button, Checkbox } from "antd";
import { useState } from "react";

const Auth = () => {
  const [authState, setAuthState] = useState<"login" | "register">("login");

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex justify-center items-center flex-col w-screen h-screen">
      <div className="mb-5 space-x-5 text-lg">
        <span
          className={`cursor-pointer ${
            authState === "login" ? "text-blue-500" : ""
          }`}
          onClick={() => setAuthState("login")}
        >
          登录
        </span>
        <span
          className={`cursor-pointer ${
            authState === "register" ? "text-blue-500" : ""
          }`}
          onClick={() => setAuthState("register")}
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
        onFinishFailed={onFinishFailed}
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

        {authState === "register" && (
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
