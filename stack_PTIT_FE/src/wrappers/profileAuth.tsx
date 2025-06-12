// src/wrappers/profileAuth.tsx
import { Navigate, useParams, Outlet } from "umi";
import { useModel } from "umi";
import { Spin } from "antd";
import { useEffect, useState } from "react";

const ProfileAuthWrapper = () => {
  const { user } = useModel("user");
  const params = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }  // Thêm debug để kiểm tra giá trị
  console.log("ProfileAuth check:", {
    user,
    "params.id": params.id, 
    userIdString: user?.id?.toString(),
    isMatch: user?.id?.toString() === params.id
  });
  
  // Kiểm tra xem user có đang truy cập profile của chính mình không
  if (!user || user.id.toString() !== params.id) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProfileAuthWrapper;
