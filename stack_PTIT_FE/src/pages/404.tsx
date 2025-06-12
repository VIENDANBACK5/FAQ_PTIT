import React from "react";
import { Button, Result } from "antd";
import { history } from "umi";

const NotFound: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
      extra={<Button type="primary" onClick={() => history.push('/')}>Quay lại Trang Chủ</Button>}
    />
  );
};

export default NotFound;
