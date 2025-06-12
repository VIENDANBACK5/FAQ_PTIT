import { history, useModel, Navigate, Outlet } from "umi";
import { useEffect, useState } from "react";
import { Spin } from "antd";

export default (props: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loadUserFromStorage } = useModel('user');
  useEffect(() => {
    const userData = loadUserFromStorage();
    const token = localStorage.getItem("token");
      if (!token) {
      // Lưu URL hiện tại để sau khi đăng nhập có thể quay lại
      localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      history.push("/auth/login");
    } else if (userData) {
      setIsAuthenticated(true);
      
      // Kiểm tra và điều hướng theo vai trò khi tải lại trang
      const currentPath = window.location.pathname;
      
      // Nếu admin đang truy cập trang user, điều hướng về dashboard
      if (userData.role === 'admin' && (currentPath === '/' || currentPath.startsWith('/questions') || currentPath.startsWith('/tags'))) {
        history.push('/dashboard');
      }
      
      // Nếu student/teacher đang truy cập trang admin, điều hướng về trang chủ
      if ((userData.role === 'student' || userData.role === 'teacher') && currentPath.startsWith('/dashboard')) {
        history.push('/');
      }
    } else {
      setIsAuthenticated(!!user);
    }
    
    setIsLoading(false);
  }, [loadUserFromStorage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    )
  }
  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/auth/login" />;
  }
};
