import { useState, useEffect } from "react";
import { message, theme } from "antd";
import { useModel } from "umi";
import { updateUserTheme } from "@/services/Users";

// Theme configs cho Ant Design
const getAntdTheme = (isDark: boolean) => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorBgContainer: isDark ? "#141414" : "#ffffff",
    colorBgElevated: isDark ? "#1f1f1f" : "#ffffff",
    colorBgLayout: isDark ? "#000000" : "#f5f5f5",
    colorBorder: isDark ? "#434343" : "#d9d9d9",
    colorText: isDark ? "#ffffffd9" : "#000000d9",
  },
});

export default () => {
  const { user, setUser } = useModel("user");

  // Khởi tạo theme từ user nếu đã đăng nhập, mặc định là 'light'
  const [theme, setThemeState] = useState<string>(() => {
    return user?.theme || "light";
  });

  // Cập nhật theme khi user thay đổi
  useEffect(() => {
    if (user?.theme && user.theme !== theme) {
      setThemeState(user.theme);
    }
  }, [user]);

  // Cập nhật theme khi thay đổi
  useEffect(() => {
    // Cập nhật data-theme attribute
    document.documentElement.setAttribute("data-theme", theme);

    // Cập nhật class trên body (giữ tương thích)
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
  }, [theme]);
  // Cập nhật theme cho user
  const updateTheme = async (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    message.success(
      `Đã chuyển sang giao diện ${newTheme === "light" ? "sáng" : "tối"}`
    );

    // Nếu user đã đăng nhập, cập nhật theme lên server và trong state user
    if (user) {
      try {
        const result = await updateUserTheme(newTheme);
        if (result.success && result.data) {
          setUser({
            ...user,
            theme: newTheme
          });
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật theme:", error);
      }
    }
  };

  // Chuyển đổi theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme as 'light' | 'dark');
  };

  return {
    theme,
    setTheme: updateTheme,
    toggleTheme,
    isDark: theme === "dark",
    antdTheme: getAntdTheme(theme === "dark"),
  };
}
