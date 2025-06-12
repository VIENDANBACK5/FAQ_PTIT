import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  LogoutOutlined,
  BarChartOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import { Outlet, Link } from "umi";
import { useModel, history } from "umi";
import Notification from "@/components/Notification";

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

const { user, handleLogout } = useModel("user");

const userMenu: MenuProps["items"] = [
  {
    key: "logout",
    icon: <LogoutOutlined className="text-red-500" />,
    label: <div className="text-red-500">Đăng xuất</div>,
    onClick: handleLogout,
  },
];

  useEffect(() => {
    // Kiểm tra quyền truy cập khi component mount
    if (!user || user.role !== "admin") {
      history.push("/403");
    }
  }, [user]);

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="flex justify-center items-center p-4">
          <h1 className="font-bold text-white text-2xl">stack PTIT</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <BarChartOutlined />,
              label: <Link to="/dashboard">Bảng điều kiển</Link>,
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: <Link to="/dashboard/users">Người dùng</Link>,
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: <Link to="/dashboard/questions">Câu hỏi</Link>,
            },
            {
              key: "4",
              icon: <TagOutlined />,
              label: <Link to="/dashboard/tags">Quản lý tag</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: "20px ",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="flex items-center">
            <Notification numberOfNotifications={0} bellColor={"#1677ff"} />
            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
              <div className="flex items-center ml-4 cursor-pointer">
                <Avatar
                  style={{ backgroundColor: "#1677ff" }}
                  icon={<UserOutlined />}
                  src={user?.avatar}
                />
                <span className="ml-2">{user?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
