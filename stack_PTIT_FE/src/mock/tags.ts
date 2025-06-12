import { Tag } from "@/services/Tags/typing";
import { parse } from 'url';

export const tags: Tag[] = [
  { id: 1, name: "nodejs", description: "Node.js is a JavaScript runtime built on Chrome's V8 engine" },
  { id: 2, name: "javascript", description: "JavaScript is a programming language that conforms to the ECMAScript specification" },
  { id: 3, name: "restapi", description: "REST (REpresentational State Transfer) is an architectural style for designing networked applications" },
  { id: 4, name: "backend", description: "Backend refers to the server-side of web development" },
  { id: 5, name: "react", description: "React is a JavaScript library for building user interfaces" },
  { id: 6, name: "performance", description: "Performance optimization techniques for applications" },
  { id: 7, name: "frontend", description: "Frontend refers to the client-side of web development" },
  { id: 8, name: "umijs", description: "UmiJS is an extensible enterprise-level React application framework" },
  { id: 9, name: "authentication", description: "Authentication is the process of verifying who a user is" },
  { id: 10, name: "typescript", description: "TypeScript is a superset of JavaScript that adds static types" },
  { id: 11, name: "graphql", description: "GraphQL is a query language for APIs and a runtime for executing those queries with your existing data" },
  { id: 12, name: "docker", description: "Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers" },
  { id: 13, name: "kubernetes", description: "Kubernetes is an open-source system for automating the deployment, scaling, and management of containerized applications" },
  { id: 14, name: "microservices", description: "Microservices is an architectural style that structures an application as a collection of loosely coupled services" },
];

// Bảng liên kết giữa questions và tags
export const question_tags = [
  { question_id: 1, tag_id: 1 }, // nodejs
  { question_id: 1, tag_id: 2 }, // javascript
  { question_id: 1, tag_id: 3 }, // restapi
  { question_id: 1, tag_id: 4 }, // backend
  
  { question_id: 2, tag_id: 5 }, // react
  { question_id: 2, tag_id: 2 }, // javascript
  { question_id: 2, tag_id: 6 }, // performance
  { question_id: 2, tag_id: 7 }, // frontend
  
  { question_id: 3, tag_id: 8 }, // umijs
  { question_id: 3, tag_id: 9 }, // authentication
  { question_id: 3, tag_id: 5 }, // react
  { question_id: 3, tag_id: 10 }, // typescript

  { question_id: 4, tag_id: 11 }, // graphql
  { question_id: 4, tag_id: 12 }, // docker
  { question_id: 4, tag_id: 13 }, // kubernetes
  { question_id: 4, tag_id: 14 }, // microservices
];

// Bảng liên kết giữa users và tags (tag follows)
export const user_tag_follows = [
  { user_id: 1, tag_id: 5 }, // student 1 follows react
  { user_id: 1, tag_id: 10 }, // student 1 follows typescript
  { user_id: 1, tag_id: 2 }, // student 1 follows javascript
  
  { user_id: 2, tag_id: 1 }, // teacher follows nodejs
  { user_id: 2, tag_id: 4 }, // teacher follows backend
  { user_id: 2, tag_id: 3 }, // teacher follows restapi
  
  { user_id: 4, tag_id: 7 }, // student 2 follows frontend
  { user_id: 4, tag_id: 5 }, // student 2 follows react
  { user_id: 4, tag_id: 6 }, // student 2 follows performance
];

// Mặc định export API endpoints
export default {
  // API lấy danh sách tags
  'GET /api/tags': (req: any, res: any) => {
    // Tính toán số lượng câu hỏi cho mỗi tag
    const tagsWithCount = tags.map(tag => {
      const count = question_tags.filter(qt => qt.tag_id === tag.id).length;
      return {...tag, count};
    });
    
    res.send({
      success: true,
      data: tagsWithCount,
    });
  },
  
  // API tìm kiếm tags (đặt trước route có param)
  'GET /api/tags/search': (req: any, res: any) => {
    const { query = {} } = parse(req.url || '', true);
    const { keyword } = query;
    
    let result = [...tags];
    
    if (keyword) {
      const searchKeyword = (keyword as string).toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(searchKeyword) || 
        (t.description && t.description.toLowerCase().includes(searchKeyword))
      );
    }
    
    // Tính toán số lượng câu hỏi cho các tags được lọc
    const tagsWithCount = result.map(tag => {
      const count = question_tags.filter(qt => qt.tag_id === tag.id).length;
      return {...tag, count};
    });
    
    res.send({
      success: true,
      data: tagsWithCount,
    });
  },
  
  // API lấy chi tiết một tag (đặt sau route cố định)
  'GET /api/tags/:id': (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    const tag = tags.find(t => t.id === id);
    
    if (tag) {
      const count = question_tags.filter(qt => qt.tag_id === id).length;
      res.send({
        success: true,
        data: {...tag, count},
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'Không tìm thấy tag',
      });
    }
  },

  // API lấy tags theo dõi của user hiện tại
  'GET /api/user/tag-follows': (req: any, res: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để xem tags theo dõi',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    
    // Lấy danh sách tag_id mà user đang theo dõi
    const userTagIds = user_tag_follows
      .filter(utf => utf.user_id === userId)
      .map(utf => utf.tag_id);
    
    // Lấy thông tin chi tiết của các tag
    const followedTags = tags
      .filter(tag => userTagIds.includes(tag.id))
      .map(tag => {
        const count = question_tags.filter(qt => qt.tag_id === tag.id).length;
        return {...tag, count};
      });
    
    res.send({
      success: true,
      data: followedTags,
    });
  },

  // API cập nhật danh sách tags theo dõi của user
  'POST /api/user/tag-follows': (req: any, res: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { tagIds } = req.body; // Mảng chứa các id của tags muốn follow
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để cập nhật tags theo dõi',
      });
    }
    
    if (!Array.isArray(tagIds)) {
      return res.status(400).send({
        success: false,
        message: 'Dữ liệu không hợp lệ',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    
    // Xóa tất cả tag follows hiện tại của user này
    const userFollowsIndex = user_tag_follows.findIndex(utf => utf.user_id === userId);
    while (userFollowsIndex !== -1) {
      user_tag_follows.splice(userFollowsIndex, 1);
      const nextIndex = user_tag_follows.findIndex(utf => utf.user_id === userId);
      if (nextIndex === -1) break;
    }
    
    // Thêm các tag follows mới
    tagIds.forEach(tagId => {
      if (tags.some(t => t.id === tagId)) {
        user_tag_follows.push({
          user_id: userId,
          tag_id: tagId,
        });
      }
    });
    
    // Lấy thông tin chi tiết của các tag đã cập nhật
    const updatedFollows = tags
      .filter(tag => tagIds.includes(tag.id))
      .map(tag => {
        const count = question_tags.filter(qt => qt.tag_id === tag.id).length;
        return {...tag, count};
      });
    
    res.send({
      success: true,
      data: updatedFollows,
      message: 'Đã cập nhật danh sách tags theo dõi',
    });
  },

  // API thêm tag
  'POST /api/tags': (req: any, res: any) => {
    const { name, description } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).send({ success: false, message: 'Tên tag là bắt buộc' });
    }
    if (tags.some(t => t.name.toLowerCase() === name.trim().toLowerCase())) {
      return res.status(400).send({ success: false, message: 'Tag đã tồn tại' });
    }
    const nextId = tags.length > 0 ? Math.max(...tags.map(t => t.id)) + 1 : 1;
    const newTag = { id: nextId, name: name.trim(), description: description?.trim?.() || "" };
    tags.push(newTag);
    res.send({ success: true, data: { ...newTag, count: 0 } });
  },

  // API sửa tag
  'PUT /api/tags/:id': (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    const { name, description } = req.body;
    const tag = tags.find(t => t.id === id);
    if (!tag) {
      return res.status(404).send({ success: false, message: 'Không tìm thấy tag' });
    }
    if (!name || name.trim() === "") {
      return res.status(400).send({ success: false, message: 'Tên tag là bắt buộc' });
    }
    if (tags.some(t => t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== id)) {
      return res.status(400).send({ success: false, message: 'Tag đã tồn tại' });
    }
    tag.name = name.trim();
    tag.description = description?.trim?.() || "";
    const count = question_tags.filter(qt => qt.tag_id === id).length;
    res.send({ success: true, data: { id: tag.id, name: tag.name, description: tag.description, count } });
  },

  // API xoá tag
  'DELETE /api/tags/:id': (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    const idx = tags.findIndex(t => t.id === id);
    if (idx === -1) {
      return res.status(404).send({ success: false, message: 'Không tìm thấy tag' });
    }
    tags.splice(idx, 1);
    // Xoá liên kết với question_tags và user_tag_follows
    for (let i = question_tags.length - 1; i >= 0; i--) {
      if (question_tags[i].tag_id === id) question_tags.splice(i, 1);
    }
    for (let i = user_tag_follows.length - 1; i >= 0; i--) {
      if (user_tag_follows[i].tag_id === id) user_tag_follows.splice(i, 1);
    }
    // Return the latest tags for debug
    res.send({ success: true, message: 'Đã xoá tag', tags });
  },
};