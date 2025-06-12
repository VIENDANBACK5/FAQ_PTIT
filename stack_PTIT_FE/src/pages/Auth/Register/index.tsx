import { Form, Input, Button, Card, Divider, message, Checkbox } from "antd";
import React, { useState } from "react";
import { Link, useModel, history } from "umi";
import { register } from "@/services/auth";
import SocialAuth from "@/components/SocialAuth";


const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const { setUser, redirectBasedOnRole } = useModel('user');
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!values.agreement) {
      message.error("Bạn cần đồng ý với điều khoản sử dụng!");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        email: values.email,
        password: values.password,
        username: values.username,
      });
      
      if (res.success) {
        // Store authentication and user data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        
        message.success("Đăng ký thành công! Đang đăng nhập...");
        
        // Redirect user based on role instead of going to login page
        redirectBasedOnRole(res.data.user);
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Lỗi đăng ký");
    } finally {
      setLoading(false);
    }
  };
  // // Xử lý khi người dùng xác nhận role
  // const handleRoleConfirm = (role: string) => {
  //   // Chuyển hướng người dùng sau khi chọn role
  //   redirectBasedOnRole({...JSON.parse(localStorage.getItem("user") || "{}"), role});
  // };
  //   // Chuyển hướng nếu modal đóng mà không chọn role
  // const handleModalClose = () => {
  //   setRoleModalVisible(false);
    
  //   // Lấy thông tin user hiện tại
  //   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    
  //   // Nếu user chưa có role, đặt giá trị mặc định là 'student'
  //   if (!currentUser.role || currentUser.role === "") {
  //     currentUser.role = "student";
  //     // Cập nhật localStorage với role mặc định
  //     localStorage.setItem("user", JSON.stringify(currentUser));
      
  //     // Cập nhật state với role mặc định
  //     setUser(currentUser);
  //   }
    
  //   // Chuyển hướng với thông tin user đã cập nhật
  //   redirectBasedOnRole(currentUser);
  // };

  return (
    <>
      <Card 
        title="Đăng ký tài khoản mới"
        className="shadow-md w-full max-w-md register-card"
        headStyle={{ fontSize: "20px", textAlign: "center", fontWeight: "bold" }}
      >
        <SocialAuth />
        <Divider style={{ borderColor: "#d9d9d9" }}>hoặc đăng ký với email</Divider>
        
        <Form 
          form={form}
          name="register" 
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label={<span className="font-bold">Tên đầy đủ</span>}
            rules={[
              { required: true, message: "Vui lòng nhập tên của bạn!" },
              { min: 3, message: "Tên phải có ít nhất 3 ký tự!" }
            ]}
          >
            <Input 
              placeholder="Nhập tên đầy đủ của bạn" 
              size="large" 
            />
          </Form.Item>
          
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
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
            ]}
          >
            <Input.Password
              placeholder="Tạo mật khẩu mới"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label={<span className="font-bold">Xác nhận mật khẩu</span>}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              })
            ]}
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu của bạn"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Bạn cần đồng ý với điều khoản sử dụng!')) 
              }
            ]}
          >
            <Checkbox>
              Tôi đã đọc và đồng ý với <a href="#" className="text-blue-600">Điều khoản sử dụng</a> và <a href="#" className="text-blue-600">Chính sách bảo mật</a>
            </Checkbox>
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700 w-full"
              size="large"
            >
              Đăng ký
            </Button>
          </Form.Item>
          
          <div className="text-center">
            Đã có tài khoản? <Link className="text-blue-600 hover:text-blue-800" to="/auth/login">Đăng nhập</Link>
          </div>
        </Form>
      </Card>      {/* Modal chọn role */}
    </>
  );
};

export default RegisterPage;