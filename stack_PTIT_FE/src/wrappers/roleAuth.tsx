import { useModel, Navigate, Outlet } from "umi";
import { useEffect, useState } from "react";
import { Spin } from "antd";

interface RoleAuthProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

export default (props: RoleAuthProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, loadUserFromStorage } = useModel("user");
  // Lấy tham số từ route config
  // @ts-ignore - Access route config through props
  const routeAllowedRoles = props.route?.allowedRoles || [];
  // Nếu không có trong route config, thử lấy từ props trực tiếp
  const allowedRoles = props.allowedRoles || routeAllowedRoles || [];
  const redirectPath = props.redirectPath || "/403";

  useEffect(() => {
    // Nếu không có user, tải từ localStorage
    if (!user) {
      loadUserFromStorage();
    }
    setIsLoading(false);
  }, [loadUserFromStorage]);

  // Thêm log để debug
  console.log("roleAuth check:", {
    user,
    allowedRoles,
    hasAccess: user && allowedRoles.includes(user.role),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Nếu chưa đăng nhập, cho phép truy cập (sẽ kiểm tra auth ở wrapper auth)
  if (!user) {
    return <Outlet />;
  }

  // Kiểm tra vai trò người dùng
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  // Điều hướng đến trang lỗi
  return <Navigate to={redirectPath} />;
};
