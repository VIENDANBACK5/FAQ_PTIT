import {users} from './users';
import { Answer } from '@/services/Answers/typing';

const answers: Answer[] = [
  {
    id: 1,
    question_id: 1,
    user_id: 2,
    content: "Để tạo một REST API với Node.js, bạn có thể sử dụng Express.js - một framework phổ biến và dễ sử dụng. Đây là các bước cơ bản:\n\n1. Cài đặt Node.js và npm\n2. Tạo thư mục dự án và khởi tạo package.json: `npm init -y`\n3. Cài đặt Express: `npm install express`\n4. Tạo file index.js với nội dung sau:\n\n```javascript\nconst express = require('express');\nconst app = express();\nconst port = 3000;\n\napp.use(express.json());\n\napp.get('/api/items', (req, res) => {\n  res.json([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);\n});\n\napp.post('/api/items', (req, res) => {\n  const newItem = req.body;\n  // Xử lý lưu dữ liệu vào database\n  res.status(201).json(newItem);\n});\n\napp.listen(port, () => {\n  console.log(`API running at http://localhost:${port}`);\n});\n```\n\n5. Chạy server: `node index.js`\n\nĐể API chuyên nghiệp hơn, bạn nên thêm các middleware như cors, helmet để bảo mật, và mongoose hoặc sequelize để kết nối database.",
    created_at: "2023-10-02",
    updated_at: "2023-10-02",
    upvotes: 7,
    downvotes: 0,
    is_accepted: false,
    user: users[1],
    comment_count: 2
  },
  {
    id: 5,
    question_id: 2,
    user_id: 1, // sinh viên 1
    content: "Từ kinh nghiệm của tôi, có một số cách để tối ưu hiệu suất trong React:\n\n1. **Sử dụng React.memo và useMemo**: Tránh re-render không cần thiết bằng cách bọc components với React.memo và sử dụng useMemo cho các phép tính phức tạp.\n\n2. **Ảo hóa danh sách (List Virtualization)**: Khi hiển thị danh sách lớn, chỉ render những phần đang trong viewport. Sử dụng thư viện như react-window hoặc react-virtualized.\n\n3. **Code-splitting**: Chia nhỏ bundle JS để tải theo nhu cầu sử dụng React.lazy và Suspense.\n\n4. **Tối ưu hóa hình ảnh**: Sử dụng lazy loading và định dạng hình ảnh phù hợp.\n\nHy vọng điều này giúp ích!",
    created_at: "2023-10-05",
    updated_at: "2023-10-05",
    upvotes: 5,
    downvotes: 0,
    is_accepted: true, // Được chấp nhận
    user: users[0], // Đối tượng user của sinh viên 1
    comment_count: 1
  },
  {
    id: 2,
    question_id: 1,
    user_id: 4,
    content: "Ngoài Express.js mà giảng viên đã đề cập, bạn cũng có thể thử NestJS - một framework Node.js hiện đại được xây dựng trên Express và sử dụng TypeScript.\n\nNestJS cung cấp kiến trúc ứng dụng module, dependency injection và nhiều tính năng cao cấp khác. Nó rất phù hợp cho các API lớn và phức tạp.\n\nĐây là một ví dụ đơn giản với NestJS:\n\n```typescript\n// items.controller.ts\nimport { Controller, Get, Post, Body } from '@nestjs/common';\n\n@Controller('items')\nexport class ItemsController {\n  @Get()\n  findAll() {\n    return [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];\n  }\n\n  @Post()\n  create(@Body() createItemDto) {\n    return createItemDto;\n  }\n}\n```\n\nNestJS có learning curve cao hơn Express nhưng lại mang lại cấu trúc và tính bảo trì tốt hơn cho dự án lớn.",
    created_at: "2023-10-03",
    updated_at: "2023-10-03",
    upvotes: 5,
    downvotes: 0,
    is_accepted: false,
    user: users[2],
    comment_count: 1
  },
  {
    id: 3,
    question_id: 2,
    user_id: 4,
    content: "Tối ưu hóa hiệu suất React là một chủ đề rộng lớn, nhưng đây là một số kỹ thuật phổ biến:\n\n1. **Code-splitting với React.lazy và Suspense**: Chia nhỏ bundle để tải theo nhu cầu\n2. **Virtualization**: Sử dụng thư viện như react-window hoặc react-virtualized để render một số lượng lớn mục mà không ảnh hưởng đến hiệu suất\n3. **useMemo cho tính toán phức tạp**: Tránh tính toán lại những giá trị phức tạp mỗi lần render\n4. **Debounce và throttle cho các sự kiện thường xuyên**: Như scroll, resize, input search\n5. **Web Workers**: Di chuyển xử lý nặng ra khỏi main thread\n6. **Profiling**: Sử dụng React Profiler và Chrome Performance tab để tìm bottleneck\n\nNếu bạn đề cập cụ thể hơn về vấn đề, tôi có thể cho lời khuyên chi tiết hơn.",
    created_at: "2023-10-06",
    updated_at: "2023-10-06",
    upvotes: 12,
    downvotes: 0,
    is_accepted: false,
    user: users[2],
    comment_count: 0
  }
];

export default answers;