import {users} from './users';
import { Comment } from '@/services/Comments/typing';

const comments: Comment[] = [
  {
    id: 1,
    user_id: 4,
    content: "Rất hữu ích, cảm ơn thầy!",
    created_at: "2023-10-02",
    answer_id: 1,
    user: users[0],
  },
  {
    id: 2,
    user_id: 1,
    content: "Bạn có thể thêm dotenv để quản lý biến môi trường nữa nhé",
    created_at: "2023-10-03",
    answer_id: 1,
    user: users[2],
  },
  {
    id: 3,
    user_id: 1,
    content:
      "NestJS có vẻ phức tạp hơn cho người mới bắt đầu, nhưng cảm ơn về gợi ý này!",
    created_at: "2023-10-04",
    answer_id: 2,
    user: users[0],
  },
];

export default comments;