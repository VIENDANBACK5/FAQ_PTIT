export interface Vote {
  id: number;
  user_id: number;
  vote_type: 1 | -1;
  question_id?: number;
  answer_id?: number;
}
