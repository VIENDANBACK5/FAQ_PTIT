import { User } from "../Users/typing";

export interface Comment {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
  answer_id: number;

  // Các trường quan hệ
  user?: User;
}
