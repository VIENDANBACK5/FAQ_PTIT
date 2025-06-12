export interface SavedQuestion {
  id: number;
  user_id: number;
  question_id: number;
  saved_at: string;
}

export interface SavedQuestionWithDetails {
  saved_id: number;
  saved_at: string;
  question: {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at?: string;
    user_id: number;
    upvotes: number;
    downvotes: number;
    views: number;
    status: string;
    user?: {
      id: number;
      username: string;
      avatar?: string;
    };
    tags?: {
      id: number;
      name: string;
      description?: string;
    }[];
    answer_count?: number;
  };
}