import { Vote } from '@/services/Votes/typing';

const votes: Vote[] = [
  // Votes cho question 1
  { id: 1, user_id: 2, vote_type: 1, question_id: 1 },
  { id: 2, user_id: 3, vote_type: 1, question_id: 1 },
  // ... thêm votes khác
  
  // Votes cho answer 1
  { id: 10, user_id: 1, vote_type: 1, answer_id: 1 },
  { id: 11, user_id: 3, vote_type: 1, answer_id: 1 },
];

export default votes;