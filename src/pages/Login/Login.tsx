import "./login.scss";

import { Button, Form, Input, Typography, notification } from "antd";
import { useMutation } from "@tanstack/react-query";

import { login } from "../../lib/pocketbase";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export default function Login() {
  const [api, contextHolder] = notification.useNotification();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: login,
  });

  const onFinish = async (values: any) => {
    try {
      await mutateAsync({ ...values });
      window.location.reload();
    } catch (error) {
      api.error({
        message: "Gagal",
        description: "Kamu gagal masuk",
      });
    }
  };

  return (
    <div className="login">
      {contextHolder}
      <img
        src="https://pindad-enjiniring.com/wp-content/uploads/2022/02/PEI-pindad-new1.png"
        alt=""
        className="icons"
      />

      <Typography.Title level={2}>
        Sistem Informasi Korespondensi Internal Departement Pengadaan
      </Typography.Title>

      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Tolong masukkan username dengan benar!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Tolong masukkan password dengan benar!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button loading={isLoading} type="primary" htmlType="submit">
            Masuk
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
