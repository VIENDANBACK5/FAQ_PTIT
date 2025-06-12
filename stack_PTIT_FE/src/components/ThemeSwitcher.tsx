import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useModel } from "umi";

const ThemeSwitcher: React.FC = () => {
  const { toggleTheme, theme, isDark } = useModel("theme");

  return (
    <>
      <div className="flex items-center space-x-2">
        <Tooltip title="Bật/Tắt chế độ tối">
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            className={theme === "dark" ? "text-yellow-400" : "text-white"}
          />
        </Tooltip>
      </div>

    </>
  );
};

export default ThemeSwitcher;
