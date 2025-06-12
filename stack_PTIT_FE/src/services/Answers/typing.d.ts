import { User } from "../Users/typing";
import { Comment } from "../Comments/typing";

export interface Answer {
  id: number;
  question_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at?: string;
  upvotes: number;
  downvotes: number;
  is_accepted: boolean;
  // Các trường quan hệ
  user?: User;
  comments?: Comment[];
  comment_count?: number;
  
  // API response fields
  question_title?: string;
  question_content?: string;
}
