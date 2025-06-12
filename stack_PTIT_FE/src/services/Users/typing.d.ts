export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  created_at: string;
  reputation: number;  
  avatar?: string; // thêm cho UI
  title?: string; // thêm cho UI
  bio?: string; // thêm cho UI
  role: string;
  theme?: "light" | "dark"; // Chọn giao diện: light hoặc dark
  is_activate?: boolean; // true: hoạt động, false: đã khoá
}
