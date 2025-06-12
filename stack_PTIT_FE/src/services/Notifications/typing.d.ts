export interface Notification {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
  is_read: boolean;
  type: 'answer' | 'vote' | 'comment';
  related_id?: number;
  question_id?: number;
  answer_id?: number;
}