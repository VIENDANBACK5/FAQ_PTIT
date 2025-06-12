import React from 'react';
import { Button, Result, Typography, Space } from 'antd';
import { history, useModel } from 'umi';

const { Paragraph, Text } = Typography;

const AuthAccessDenied: React.FC = () => {
  const { user } = useModel('user');
  
  // Xác định đường dẫn quay về dựa trên vai trò
  const handleBackHome = () => {
    if (!user) {
      history.push('/auth/login');
      return;
    }
    
    switch (user.role) {
      case 'admin':
        history.push('/dashboard');
        break;
      case 'teacher':
      case 'student':
        history.push('/');
        break;
      default:
        history.push('/');
    }
  };

  // Lấy tên vai trò hiển thị thân thiện với người dùng
  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'teacher': return 'Giáo viên';
      case 'student': return 'Học sinh';
      default: return role;
    }
  };

  return (
    <Result
      status="403"
      title="Không có quyền truy cập"
      subTitle={
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Paragraph>
            <Text strong>
              Xin lỗi, bạn không có quyền truy cập vào trang này.
            </Text>
          </Paragraph>
          
          {user ? (
            <Paragraph>
              Tài khoản của bạn có vai trò <Text mark>{getRoleName(user.role)}</Text>{' '}
              không được phép truy cập vào trang này.
            </Paragraph>
          ) : (
            <Paragraph>
              Bạn cần đăng nhập để truy cập trang này hoặc tài khoản của bạn không có quyền truy cập.
            </Paragraph>
          )}
          
          <Paragraph type="secondary">
            Nếu bạn tin rằng đây là lỗi, vui lòng liên hệ với quản trị viên hệ thống.
          </Paragraph>
        </Space>
      }
      extra={
        <Space>
          {!user && (
            <Button type="primary" onClick={() => history.push('/auth/login')}>
              Đăng nhập
            </Button>
          )}
          <Button type="primary" onClick={handleBackHome}>
            {user ? 'Quay về trang chủ' : 'Quay về trang chính'}
          </Button>
          <Button onClick={() => history.back()}>
            Quay lại trang trước
          </Button>
        </Space>
      }
    />
  );
};

export default AuthAccessDenied;