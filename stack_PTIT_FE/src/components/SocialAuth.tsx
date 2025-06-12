import React from 'react'
import { Button, message } from 'antd';
import {
    GoogleOutlined,
    FacebookOutlined,
    GithubOutlined,
} from '@ant-design/icons';

const SocialAuth: React.FC = () => {
  return (
    <div className="flex gap-2 mb-4">
        <Button
          type="default"
          className="flex justify-center items-center bg-[#db4437] hover:opacity-90 h-10 text-white"
          style={{ width: "calc(100%/3 - 10px)" }}
          icon={<GoogleOutlined />}
          onClick={() => {
            message.info("Chưa phát triển tính năng");
          }}
        />
        <Button
          type="default"
          className="flex justify-center items-center bg-[#3b5998] hover:opacity-90 h-10 text-white"
          style={{ width: "calc(100%/3 - 10px)" }}
          icon={<FacebookOutlined />}
          onClick={() => {
            message.info("Chưa phát triển tính năng");
          }}
        />
        <Button
          type="default"
          className="flex justify-center items-center bg-[#333] hover:opacity-90 h-10 text-white"
          style={{ width: "calc(100%/3 - 10px)" }}
          icon={<GithubOutlined />}
          onClick={() => {
            message.info("Chưa phát triển tính năng");
          }}
        />
    </div>
  )
}

export default SocialAuth