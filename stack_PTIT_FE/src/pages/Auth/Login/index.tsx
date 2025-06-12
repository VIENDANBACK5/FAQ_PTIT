import React, { useState } from "react";
import { Form, Input, Button, Card, Divider, message } from "antd";
import {
  GoogleOutlined,
  FacebookOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { Link, useModel } from "umi";
import { login } from "@/services/auth";
import { history } from "umi";
import request from 'umi-request';
import { API_URL } from "@/config";

const LoginPage: React.FC = () => {  const [loading, setLoading] = useState(false);
  const { setUser, redirectBasedOnRole } = useModel('user');
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await login(values);
      // Xử lý response chuẩn OAuth2
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        // Gọi API lấy user info
        try {
          const userRes = await request.get(API_URL + "/users/me", {
            headers: { Authorization: `Bearer ${res.access_token}` },
          });
          localStorage.setItem("user", JSON.stringify(userRes));
          setUser(userRes);
          message.success("Đăng nhập thành công");
          redirectBasedOnRole(userRes);
          return;
        } catch (e) {
          // Nếu lỗi vẫn cho đăng nhập nhưng không có user
          localStorage.removeItem("user");
        }
      }
      // Xử lý response kiểu cũ (nếu có)
      if (res.success && res.data) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        message.success("Đăng nhập thành công");
        redirectBasedOnRole(res.data.user);
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  request.interceptors.request.use((url, options) => {
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return { url, options };
  });

  return (
    
        <Card 
          title="Đăng nhập vào Stack PTIT"
          className="shadow-md w-full max-w-md login-card"
          styles={{ header: { fontSize: "20px", textAlign: "center", fontWeight: "bold" } }}
        >
          <div className="flex gap-2 mb-4">
            <Button
              type="default"
              className="flex justify-center items-center bg-[#db4437] hover:opacity-90 h-10 text-white"
              style={{ width: "calc(100%/3 - 10px)" }}
              icon={<GoogleOutlined />}
            />
            <Button
              type="default"
              className="flex justify-center items-center bg-[#3b5998] hover:opacity-90 h-10 text-white"
              style={{ width: "calc(100%/3 - 10px)" }}
              icon={<FacebookOutlined />}
            />
            <Button
              type="default"
              className="flex justify-center items-center bg-[#333] hover:opacity-90 h-10 text-white"
              style={{ width: "calc(100%/3 - 10px)" }}
              icon={<GithubOutlined />}
            />
          </div>
          
          <Divider style={{ borderColor: "#d9d9d9" }}>hoặc đăng nhập với email</Divider>
          
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              label={<span className="font-bold">Email</span>}
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không đúng định dạng!" }
              ]}
            >
              <Input 
                placeholder="Nhập địa chỉ email của bạn" 
                size="large" 
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              label={<span className="font-bold">Mật khẩu</span>}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu của bạn"
                size="large"
              />
            </Form.Item>
            
            <div className="mb-4 text-right">
              <Link className="text-blue-600 hover:text-blue-800" to="/forgot-password">
                Quên mật khẩu?
              </Link>
            </div>
            
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Đăng nhập
              </Button>
            </Form.Item>
            
            <div className="text-center">
              Chưa có tài khoản? <Link className="text-blue-600 hover:text-blue-800" to="/auth/register">Đăng ký ngay</Link>
            </div>
          </Form>
        </Card>
  );
};

export default LoginPage;
