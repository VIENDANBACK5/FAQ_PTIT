import React from "react";
import { Button, Result } from "antd";

const ServerError: React.FC = () => (
  <Result
    status="500"
    title="500"
    subTitle="Xin lỗi, đã xảy ra lỗi máy chủ."
    extra={<Button type="primary">Quay lại Trang Chủ</Button>}
  />
);

export default ServerError;
