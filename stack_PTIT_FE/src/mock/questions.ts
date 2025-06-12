import { Question } from '@/services/Questions/typing';
import { Answer } from '@/services/Answers/typing';
import { Comment } from '@/services/Comments/typing';

import { tags, question_tags } from './tags';
import { Vote } from '@/services/Votes/typing';
import { parse } from 'url';
import { format } from 'date-fns';

import {users} from "./users";
import answers from './answers';
import comments from './comments';
import votes from './votes';

// Dữ liệu mẫu cho questions
export const questionsData: Question[] = [  // ← THÊM EXPORT
  {
    id: 1,
    user_id: 4,
    title: "Làm thế nào để tạo một REST API với Node.js?",
    content:
      "Tôi đang học về phát triển web và muốn tạo một REST API đơn giản bằng Node.js. Có thể cho tôi hướng dẫn chi tiết về cách thực hiện không?",
    created_at: "2023-10-01",
    updated_at: "2023-10-01",
    views: 120,
    upvotes: 15,
    downvotes: 0,
    user: users[2],
    tags: [tags[0], tags[1], tags[2], tags[3]],
    answer_count: 2,
    status: "open",
  },
  {
    id: 2,
    user_id: 2,
    title: "Cách tối ưu hóa hiệu suất ứng dụng React",
    content:
      "Ứng dụng React của tôi đang chạy khá chậm khi xử lý một lượng lớn dữ liệu. Tôi đã thử sử dụng React.memo và useCallback nhưng vẫn chưa đạt được hiệu quả như mong đợi. Có ai có kinh nghiệm tối ưu hóa React có thể chia sẻ một số kỹ thuật không?",
    created_at: "2023-10-05",
    updated_at: "2023-10-05",
    views: 200,
    upvotes: 20,
    downvotes: 0,
    user: users[1],
    tags: [tags[4], tags[1], tags[5], tags[6]],
    answer_count: 1,
    status: "open",
  },
  {
    id: 3,
    user_id: 1,
    title: "Cách xử lý authentication trong ứng dụng UmiJS",
    content:
      "Tôi đang xây dựng một ứng dụng với UmiJS và cần triển khai hệ thống xác thực người dùng. Tôi đã thử một vài cách nhưng vẫn gặp vấn đề với việc lưu trữ token và bảo vệ các route. Ai có kinh nghiệm với UmiJS có thể chia sẻ cách tiếp cận tốt nhất?",
    created_at: "2023-10-10",
    updated_at: "2023-10-10",
    views: 150,
    upvotes: 8,
    downvotes: 0,
    user: users[0],
    tags: [tags[7], tags[8], tags[4], tags[9]],
    answer_count: 0,
    status: "closed", 
  },
  {
    id: 4,
    user_id: 4,
    title: "Cách sử dụng GraphQL trong ứng dụng React",
    content:
      "Tôi muốn tích hợp GraphQL vào ứng dụng React của mình để cải thiện hiệu suất và khả năng mở rộng. Có ai có kinh nghiệm với Apollo Client hoặc Relay có thể chia sẻ cách thiết lập và sử dụng không?",
    created_at: "2024-10-15",
    updated_at: "2024-10-15",
    views: 180,
    upvotes: 12,
    downvotes: 1,
    user: users[3],
    tags: [tags[10], tags[11], tags[12]],
    answer_count: 0,
    status: "open",
  },
];

// Alias cho backward compatibility
const questions = questionsData;

// Biến đếm cho ID mới
let nextQuestionId = questions.length + 1;
let nextAnswerId = answers.length + 1;
let nextCommentId = comments.length + 1;
let nextVoteId = votes.length + 1;

export default {
  // API lấy câu hỏi theo tag (đặt trước search để tránh conflict)
  'GET /api/questions/tagged': (req: any, res: any) => {
    const { query = {} } = parse(req.url || '', true);
    const { tag, sort, filter, page = '1', pageSize = '10' } = query;
    
    if (!tag) {
      return res.status(400).send({
        success: false,
        message: 'Tên tag là bắt buộc',
      });
    }
    
    // Tìm tag theo tên
    const targetTag = tags.find(t => t.name.toLowerCase() === (tag as string).toLowerCase());
    
    if (!targetTag) {
      return res.send({
        success: true,
        data: {
          questions: [],
          total: 0,
          page: 1,
          pageSize: 10,
        },
      });
    }
    
    // Lấy tất cả question_id có tag này
    const questionIds = question_tags
      .filter(qt => qt.tag_id === targetTag.id)
      .map(qt => qt.question_id);
    
    // Lấy các câu hỏi tương ứng
    let result = questions
      .filter(q => questionIds.includes(q.id))
      .map(question => {
        return {
          ...question,
          user: users.find(u => u.id === question.user_id),
          tags: tags.filter(t => question_tags.some(qt => qt.question_id === question.id && qt.tag_id === t.id))
            .map(t => {
              const count = question_tags.filter(qt => qt.tag_id === t.id).length;
              return { ...t, count };
            })
        };
      });
    
    // Sắp xếp câu hỏi
    if (sort === 'newest') {
      result.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
    } else if (sort === 'popular') {
      result.sort((a, b) => ((b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)));
    } else if (sort === 'votes') {
      result.sort((a, b) => (b.upvotes - a.upvotes));
    } else if (sort === 'unanswered') {
      result = result.filter(q => q.answer_count === 0);
    }
    
    // Lọc câu hỏi
    if (filter === 'no answer') {
      result = result.filter(q => q.answer_count === 0);
    } else if (filter === 'answered') {
      result = result.filter(q => (q.answer_count ?? 0) > 0);
    } else if (filter === 'accepted') {
      const acceptedQuestionIds = answers
        .filter(a => a.is_accepted)
        .map(a => a.question_id);
      result = result.filter(q => acceptedQuestionIds.includes(q.id));
    }
    
    // Phân trang
    const pageNumber = parseInt(page as string, 10);
    const pageSizeNumber = parseInt(pageSize as string, 10);
    const startIndex = (pageNumber - 1) * pageSizeNumber;
    const endIndex = pageNumber * pageSizeNumber;
    const paginatedResult = result.slice(startIndex, endIndex);
    
    res.send({
      success: true,
      data: {
        questions: paginatedResult,
        total: result.length,
        page: pageNumber,
        pageSize: pageSizeNumber,
      },
    });
  },
  
  // API tìm kiếm câu hỏi
  'GET /api/questions/search': (req: any, res: any) => {
    const { query = {} } = parse(req.url || '', true);
    const { keyword, tag } = query;
      let result = [...questions].map(question => {
      return {
        ...question,
        user: users.find(u => u.id === question.user_id),
        tags: tags.filter(t => question_tags.some(qt => qt.question_id === question.id && qt.tag_id === t.id))
          .map(t => {
            // Calculate the count for each tag
            const count = question_tags.filter(qt => qt.tag_id === t.id).length;
            return { ...t, count };
          })
      };
    });
    
    if (keyword) {
      const searchKeyword = (keyword as string).toLowerCase();
      result = result.filter(q => 
        q.title.toLowerCase().includes(searchKeyword) || 
        q.content.toLowerCase().includes(searchKeyword)
      );
    }
    
    if (tag) {
      result = result.filter(q => 
        q.tags?.some(t => t.name.toLowerCase() === (tag as string).toLowerCase())
      );
    }
    
    res.send({
      success: true,
      data: {
        list: result,
        total: result.length,
      },
    });
  },
  
  // API lấy danh sách câu hỏi
  'GET /api/questions': (req: any, res: any) => {
    const { query = {} } = parse(req.url || '', true);
    const { sort, filter, page = '1', pageSize = '10' } = query;
    
    let result = [...questions].map(question => {      
      // Kiểm tra xem câu hỏi có câu trả lời nào được chấp nhận không
      const hasAcceptedAnswer = answers.some(a => a.question_id === question.id && a.is_accepted);
      
      const questionWithRelations = {
        ...question,
        user: users.find(u => u.id === question.user_id),
        tags: tags.filter(t => question_tags.some(qt => qt.question_id === question.id && qt.tag_id === t.id))
          .map(t => {
            // Calculate the count for each tag
            const count = question_tags.filter(qt => qt.tag_id === t.id).length;
            return { ...t, count };
          }),
        has_accepted_answer: hasAcceptedAnswer
      };
      return questionWithRelations;
    });
    
    // Sắp xếp câu hỏi
    if (sort === 'newest') {
      // Sắp xếp theo ngày tạo mới nhất (gần đây nhất lên đầu)
      result.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // Sắp xếp giảm dần theo thời gian
      });
    } else if (sort === 'popular') {
      result.sort((a, b) => ((b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)));
    }
    
    // Lọc câu hỏi
    if (filter === 'no answer') {
      result = result.filter(q => q.answer_count === 0);
    } else if (filter === 'answered') {
      result = result.filter(q => (q.answer_count ?? 0) > 0);
    }
    
    // Phân trang
    const pageNumber = parseInt(page as string, 10);
    const pageSizeNumber = parseInt(pageSize as string, 10);
    const startIndex = (pageNumber - 1) * pageSizeNumber;
    const endIndex = pageNumber * pageSizeNumber;
    const paginatedResult = result.slice(startIndex, endIndex);
    
    res.send({
      success: true,
      data: {
        list: paginatedResult,
        total: result.length,
        page: pageNumber,
        pageSize: pageSizeNumber,
      },
    });
  },
  
  // API lấy chi tiết một câu hỏi
  'GET /api/questions/:id': (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    console.log("API request for question ID:", id); // Log để debug
    
    const question = questions.find(q => q.id === id);
    
    if (question) {
      // Tăng số lượt xem khi truy cập chi tiết
      const updatedQuestion = { ...question, views: question.views + 1 };
      const index = questions.findIndex(q => q.id === id);
      questions[index] = updatedQuestion;
      
      // Lấy thêm thông tin liên quan
      const questionAnswers = answers.filter(a => a.question_id === id).map(answer => {
        // Thêm thông tin người dùng và comment cho mỗi câu trả lời
        return {
          ...answer,
          user: users.find(u => u.id === answer.user_id),
          comments: comments.filter(c => c.answer_id === answer.id).map(comment => {
            return {
              ...comment,
              user: users.find(u => u.id === comment.user_id)
            };
          })
        };
      });
        const questionWithRelations = {
        ...updatedQuestion,
        user: users.find(u => u.id === updatedQuestion.user_id),
        tags: tags.filter(t => question_tags.some(qt => qt.question_id === id && qt.tag_id === t.id))
          .map(t => {
            // Calculate the count for each tag
            const count = question_tags.filter(qt => qt.tag_id === t.id).length;
            return { ...t, count };
          }),
        answers: questionAnswers
      };
      
      res.send({
        success: true,
        data: questionWithRelations,
      });
    } else {
      console.log("Question not found with ID:", id); // Log để debug
      res.status(404).send({
        success: false,
        message: 'Không tìm thấy câu hỏi',
      });
    }
  },
  
  // API tạo câu hỏi mới
  'POST /api/questions': (req: any, res: any) => {
    const { title, content, tags: tagNames } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để đặt câu hỏi',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    
    if (!title || !content) {
      return res.status(400).send({
        success: false,
        message: 'Tiêu đề và nội dung là bắt buộc',
      });
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: 'Người dùng không hợp lệ',
      });
    }
    
    // Kiểm tra vai trò - chỉ cho phép student và teacher đặt câu hỏi
    if (user.role === 'admin') {
      return res.status(403).send({
        success: false,
        message: 'Quản trị viên không có quyền đặt câu hỏi',
      });
    }
      // Tạo câu hỏi mới
    const now = format(new Date(), 'yyyy-MM-dd'); // Format date as YYYY-MM-DD
    const newQuestion: Question = {
      id: nextQuestionId++,
      user_id: userId,
      title,
      content,
      created_at: now,
      updated_at: now,
      views: 0,
      upvotes: 0,
      downvotes: 0,
      answer_count: 0,
      status: 'open',
    };
    
    questions.push(newQuestion);
    
    // Xử lý tags
    if (tagNames && Array.isArray(tagNames)) {
            tagNames.forEach(tagName => {
        const tagObj = tags.find( t => t.name === tagName);
        if (tagObj) {
          question_tags.push({ question_id: newQuestion.id, tag_id: tagObj.id });
        }
      });
    }
    
    res.send({
      success: true,
      data: {
        ...newQuestion,
        user,
        tags: tagNames || []
      }
    });
  },
  
  // API vote cho câu hỏi
  'POST /api/questions/:id/vote': (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    const { direction } = req.body; // 'up' hoặc 'down'
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để bình chọn',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    const question = questions.find(q => q.id === id);
    
    if (!question) {
      return res.status(404).send({
        success: false,
        message: 'Không tìm thấy câu hỏi',
      });
    }
    
    // Kiểm tra xem người dùng có phải là người đặt câu hỏi không
    if (question.user_id === userId) {
      return res.status(403).send({
        success: false,
        message: 'Bạn không thể bình chọn câu hỏi của chính mình',
      });
    }
    
    // Kiểm tra xem người dùng đã bình chọn câu hỏi này chưa
    const existingVote = votes.find(v => v.user_id === userId && v.question_id === id);
    
    // Cập nhật số lượt bình chọn
    if (existingVote) {
      // Nếu đã vote rồi, và vote type giống nhau thì xóa vote
      if ((direction === 'up' && existingVote.vote_type === 1) || 
          (direction === 'down' && existingVote.vote_type === -1)) {
            
        // Xóa vote khỏi danh sách
        const voteIndex = votes.findIndex(v => v.id === existingVote.id);
        votes.splice(voteIndex, 1);
        
        // Cập nhật lại số upvote/downvote
        if (direction === 'up') {
          question.upvotes -= 1;
        } else {
          question.downvotes -= 1;
        }
      } else {
        // Nếu đổi hướng vote
        existingVote.vote_type = direction === 'up' ? 1 : -1;
        
        if (direction === 'up') {
          question.upvotes += 1;
          question.downvotes -= 1;
        } else {
          question.upvotes -= 1;
          question.downvotes += 1;
        }
      }
    } else {
      // Thêm vote mới
      const newVote: Vote = {
        id: nextVoteId++,
        user_id: userId,
        vote_type: direction === 'up' ? 1 : -1,
        question_id: id
      };
      
      votes.push(newVote);
      
      // Cập nhật số vote
      if (direction === 'up') {
        question.upvotes += 1;
      } else {
        question.downvotes += 1;
      }
    }
    
    const index = questions.findIndex(q => q.id === id);
    questions[index] = question;
      // Include answers when returning a question after voting
    const questionAnswers = answers.filter(a => a.question_id === id).map(answer => {
      return {
        ...answer,
        user: users.find(u => u.id === answer.user_id),
        comments: comments.filter(c => c.answer_id === answer.id).map(comment => {
          return {
            ...comment,
            user: users.find(u => u.id === comment.user_id)
          };
        })
      };
    });
    
    const responseQuestion = {
      ...question,
      user: users.find(u => u.id === question.user_id),
      tags: tags.filter(t => question_tags.some(qt => qt.question_id === id && qt.tag_id === t.id)),
      answers: questionAnswers
    };
    
    res.send({
      success: true,
      data: responseQuestion,
    });
  },
  
  // API thêm câu trả lời
  'POST /api/questions/:id/answers': (req: any, res: any) => {
    const questionId = parseInt(req.params.id, 10);
    const { content } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để trả lời câu hỏi',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    
    if (!content) {
      return res.status(400).send({
        success: false,
        message: 'Nội dung câu trả lời là bắt buộc',
      });
    }
    
    const question = questions.find(q => q.id === questionId);
    const user = users.find(u => u.id === userId);
    
    if (!question || !user) {
      return res.status(404).send({
        success: false,
        message: 'Không tìm thấy câu hỏi hoặc người dùng',
      });
    }
    
    // Kiểm tra xem người dùng có phải là người đặt câu hỏi không
    if (question.user_id === userId) {
      return res.status(403).send({
        success: false,
        message: 'Bạn không thể tự trả lời câu hỏi của chính mình',
      });
    }
    
    // Kiểm tra vai trò - chỉ cho phép student và teacher trả lời
    if (user.role === 'admin') {
      return res.status(403).send({
        success: false,
        message: 'Quản trị viên không có quyền trả lời câu hỏi',
      });
    }
      // Tạo câu trả lời mới
    const now = format(new Date(), 'yyyy-MM-dd'); // Format date as YYYY-MM-DD
    const newAnswer: Answer = {
      id: nextAnswerId++,
      question_id: questionId,
      user_id: userId,
      content,
      created_at: now,
      updated_at: now,
      upvotes: 0,
      downvotes: 0,
      is_accepted: false,
      comment_count: 0,
      user: user,
      comments: []
    };
    
    answers.push(newAnswer);
    
    // Cập nhật số lượng câu trả lời của câu hỏi
    const questionIndex = questions.findIndex(q => q.id === questionId);
    questions[questionIndex].answer_count = (questions[questionIndex].answer_count || 0) + 1;
    
    res.send({
      success: true,
      data: newAnswer,
    });
  },
  
  // API vote cho câu trả lời
  'POST /api/questions/:questionId/answers/:answerId/vote': (req: any, res: any) => {
    const questionId = parseInt(req.params.questionId, 10);
    const answerId = parseInt(req.params.answerId, 10);
    const { direction } = req.body; // 'up' hoặc 'down'
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để bình chọn',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    const answer = answers.find(a => a.id === answerId && a.question_id === questionId);
    const question = questions.find(q => q.id === questionId);
    
    if (!answer || !question) {
      return res.status(404).send({
        success: false,
        message: 'Không tìm thấy câu trả lời hoặc câu hỏi',
      });
    }
      // Kiểm tra xem người dùng có phải là người tạo câu trả lời không
    if (answer.user_id === userId) {
      return res.status(403).send({
        success: false,
        message: 'Bạn không thể bình chọn câu trả lời của chính mình',
      });
    }
    
    // Kiểm tra xem người dùng đã bình chọn câu trả lời này chưa
    const existingVote = votes.find(v => v.user_id === userId && v.answer_id === answerId);
    
    // Cập nhật số lượt bình chọn
    if (existingVote) {
      // Tương tự như xử lý vote cho câu hỏi
      if ((direction === 'up' && existingVote.vote_type === 1) || 
          (direction === 'down' && existingVote.vote_type === -1)) {
        
        const voteIndex = votes.findIndex(v => v.id === existingVote.id);
        votes.splice(voteIndex, 1);
        
        if (direction === 'up') {
          answer.upvotes -= 1;
        } else {
          answer.downvotes -= 1;
        }
      } else {
        existingVote.vote_type = direction === 'up' ? 1 : -1;
        
        if (direction === 'up') {
          answer.upvotes += 1;
          answer.downvotes -= 1;
        } else {
          answer.upvotes -= 1;
          answer.downvotes += 1;
        }
      }
    } else {
      // Thêm vote mới
      const newVote: Vote = {
        id: nextVoteId++,
        user_id: userId,
        vote_type: direction === 'up' ? 1 : -1,
        answer_id: answerId
      };
      
      votes.push(newVote);
      
      if (direction === 'up') {
        answer.upvotes += 1;
      } else {
        answer.downvotes += 1;
      }
    }
    
    const answerIndex = answers.findIndex(a => a.id === answerId);
    answers[answerIndex] = answer;
    
    const responseAnswer = {
      ...answer,
      user: users.find(u => u.id === answer.user_id),
      comments: comments.filter(c => c.answer_id === answer.id).map(comment => ({
        ...comment,
        user: users.find(u => u.id === comment.user_id)
      }))
    };
    
    res.send({
      success: true,
      data: responseAnswer,
    });
  },
  
  // API đánh dấu câu trả lời là đúng (chấp nhận)
  'PUT /api/questions/:questionId/answers/:answerId/accept': (req: any, res: any) => {
    const questionId = parseInt(req.params.questionId, 10);
    const answerId = parseInt(req.params.answerId, 10);
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để chấp nhận câu trả lời',
      });
    }
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    const question = questions.find(q => q.id === questionId);
    if (!question) {
      return res.status(404).send({ success: false, message: 'Không tìm thấy câu hỏi', });
    }
    if (question.user_id !== userId) {
      return res.status(403).send({ success: false, message: 'Chỉ người đặt câu hỏi mới có thể chấp nhận câu trả lời', });
    }
    const answer = answers.find(a => a.id === answerId && a.question_id === questionId);
    if (!answer) {
      return res.status(404).send({ success: false, message: 'Không tìm thấy câu trả lời', });
    }
    // Reset tất cả các câu trả lời của câu hỏi này về false
    answers.forEach(a => {
      if (a.question_id === questionId) {
        a.is_accepted = false;
      }
    });
    // Đánh dấu câu trả lời được chọn là true
    const answerIndex = answers.findIndex(a => a.id === answerId);
    answers[answerIndex].is_accepted = true;

    // Tăng 5 điểm kinh nghiệm cho user trả lời nếu chưa từng được accept trước đó
    const answerUser = users.find(u => u.id === answer.user_id);
    if (answerUser) {
      // Nếu trước đó chưa được accept thì cộng điểm
      if (!answer.is_accepted) {
        answerUser.reputation += 5;
      }
    }

    const responseAnswer = {
      ...answers[answerIndex],
      user: users.find(u => u.id === answers[answerIndex].user_id),
      comments: comments.filter(c => c.answer_id === answerId).map(comment => ({
        ...comment,
        user: users.find(u => u.id === comment.user_id)
      }))
    };
    res.send({ success: true, data: responseAnswer, });
  },
  
  // API thêm bình luận cho câu trả lời
  'POST /api/questions/:questionId/answers/:answerId/comments': (req: any, res: any) => {
    const questionId = parseInt(req.params.questionId, 10);
    const answerId = parseInt(req.params.answerId, 10);
    const { content } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để bình luận',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    
    if (!content) {
      return res.status(400).send({
        success: false,
        message: 'Nội dung bình luận là bắt buộc',
      });
    }
    
    const answer = answers.find(a => a.id === answerId && a.question_id === questionId);
    const user = users.find(u => u.id === userId);
    
    if (!answer || !user) {
      return res.status(404).send({
        success: false,
        message: 'Không tìm thấy câu trả lời hoặc người dùng',
      });
    }
    
    // Kiểm tra vai trò - chỉ cho phép student và teacher bình luận
    if (user.role === 'admin') {
      return res.status(403).send({
        success: false,
        message: 'Quản trị viên không có quyền bình luận câu trả lời',
      });
    }
      // Tạo bình luận mới
    const now = format(new Date(), 'yyyy-MM-dd'); // Format date as YYYY-MM-DD
    const newComment: Comment = {
      id: nextCommentId++,
      user_id: userId,
      content,
      created_at: now,
      answer_id: answerId,
      user: user
    };
    
    comments.push(newComment);
    
    // Cập nhật số lượng bình luận của câu trả lời
    const answerIndex = answers.findIndex(a => a.id === answerId);
    answers[answerIndex].comment_count = (answers[answerIndex].comment_count || 0) + 1;
    
    res.send({
      success: true,
      data: {
        ...newComment,
        user
      }
    });
  },

  // API tìm kiếm nâng cao câu hỏi
  'GET /api/questions/search/:queryString': (req: any, res: any) => {
    const { query = {} } = parse(req.url || '', true);
    const { page = '1', pageSize = '10' } = query;
    const queryString = req.params.queryString || '';
    
    // Parse search query để extract các filters
    const parseSearchQuery = (queryStr: string) => {
      const filters: any = {
        text: '',
        tags: [],
        answers: null,
        votes: null,
        comments: null,
        user: null
      };

      // Extract quoted phrases
      const quotedRegex = /"([^"]+)"/g;
      let match;
      const quotedPhrases = [];
      while ((match = quotedRegex.exec(queryStr)) !== null) {
        quotedPhrases.push(match[1]);
      }
      
      // Extract tags [tag]
      const tagRegex = /\[([^\]]+)\]/g;
      while ((match = tagRegex.exec(queryStr)) !== null) {
        filters.tags.push(match[1].toLowerCase());
      }
      
      // Extract user filter: user:id
      const userMatch = queryStr.match(/user:(\d+)/);
      if (userMatch) {
        filters.user = parseInt(userMatch[1]);
      }
      
      // Extract answers filter with operators: answers>=2, answers=1, etc.
      const answersMatches = queryStr.match(/answers(>=|<=|>|<|=)(\d+)/g);
      if (answersMatches) {
        answersMatches.forEach(match => {
          const operatorMatch = match.match(/answers(>=|<=|>|<|=)(\d+)/);
          if (operatorMatch) {
            filters.answers = {
              operator: operatorMatch[1],
              value: parseInt(operatorMatch[2])
            };
          }
        });
      } else {
        // Fallback to old format answers:n (default to >=)
        const oldAnswersMatch = queryStr.match(/answers:(\d+)/);
        if (oldAnswersMatch) {
          filters.answers = {
            operator: '>=',
            value: parseInt(oldAnswersMatch[1])
          };
        }
      }
      
      // Extract votes filter with operators: votes>=5, votes=3, etc.
      const votesMatches = queryStr.match(/votes(>=|<=|>|<|=)(\d+)/g);
      if (votesMatches) {
        votesMatches.forEach(match => {
          const operatorMatch = match.match(/votes(>=|<=|>|<|=)(\d+)/);
          if (operatorMatch) {
            filters.votes = {
              operator: operatorMatch[1],
              value: parseInt(operatorMatch[2])
            };
          }
        });
      } else {
        // Fallback to old format votes:n (default to >=)
        const oldVotesMatch = queryStr.match(/votes:(\d+)/);
        if (oldVotesMatch) {
          filters.votes = {
            operator: '>=',
            value: parseInt(oldVotesMatch[1])
          };
        }
      }
      
      // Extract comments filter with operators: comments>=1, comments=0, etc.
      const commentsMatches = queryStr.match(/comments(>=|<=|>|<|=)(\d+)/g);
      if (commentsMatches) {
        commentsMatches.forEach(match => {
          const operatorMatch = match.match(/comments(>=|<=|>|<|=)(\d+)/);
          if (operatorMatch) {
            filters.comments = {
              operator: operatorMatch[1],
              value: parseInt(operatorMatch[2])
            };
          }
        });
      } else {
        // Fallback to old format comments:n (default to >=)
        const oldCommentsMatch = queryStr.match(/comments:(\d+)/);
        if (oldCommentsMatch) {
          filters.comments = {
            operator: '>=',
            value: parseInt(oldCommentsMatch[1])
          };
        }
      }
      
      // Remove special syntax and get remaining text
      let remainingText = queryStr
        .replace(/"[^"]+"/g, '')
        .replace(/\[[^\]]+\]/g, '')
        .replace(/user:\d+/g, '')
        .replace(/answers(>=|<=|>|<|=)\d+/g, '')
        .replace(/votes(>=|<=|>|<|=)\d+/g, '')
        .replace(/comments(>=|<=|>|<|=)\d+/g, '')
        .replace(/answers:\d+/g, '')
        .replace(/votes:\d+/g, '')
        .replace(/comments:\d+/g, '')
        .trim();
        
      // Add quoted phrases to text search
      if (quotedPhrases.length > 0) {
        remainingText += ' ' + quotedPhrases.join(' ');
      }
      
      filters.text = remainingText.trim();
      
      return filters;
    };
    
    let results = [...questions].map(question => {
      // Get question tags
      const questionTags = tags.filter(t => 
        question_tags.some(qt => qt.question_id === question.id && qt.tag_id === t.id)
      );
      
      // Get comment count for this question (comments are on answers, so we need to count through answers)
      const questionAnswers = answers.filter(a => a.question_id === question.id);
      const commentCount = comments.filter(c => 
        questionAnswers.some(a => a.id === c.answer_id)
      ).length;
      
      return {
        ...question,
        user: users.find(u => u.id === question.user_id),
        tags: questionTags,
        comment_count: commentCount,
        vote_score: question.upvotes - question.downvotes
      };
    });
    
    if (queryString) {
      const filters = parseSearchQuery(decodeURIComponent(queryString));
      
      // Filter by text (title and content)
      if (filters.text) {
        const searchText = filters.text.toLowerCase();
        results = results.filter(question => 
          question.title.toLowerCase().includes(searchText) ||
          question.content.toLowerCase().includes(searchText)
        );
      }
      
      // Filter by tags
      if (filters.tags.length > 0) {
        results = results.filter(question =>
          filters.tags.some((tagName: string) =>
            question.tags.some(tag => tag.name.toLowerCase() === tagName)
          )
        );
      }
      
      // Filter by user
      if (filters.user !== null) {
        results = results.filter(question => question.user_id === filters.user);
      }
      
      // Filter by answers with operator
      if (filters.answers !== null) {
        const { operator, value } = filters.answers;
        results = results.filter(question => {
          const count = question.answer_count || 0;
          switch (operator) {
            case '>=': return count >= value;
            case '<=': return count <= value;
            case '>': return count > value;
            case '<': return count < value;
            case '=': return count === value;
            default: return count >= value;
          }
        });
      }
      
      // Filter by votes with operator
      if (filters.votes !== null) {
        const { operator, value } = filters.votes;
        results = results.filter(question => {
          const score = question.vote_score;
          switch (operator) {
            case '>=': return score >= value;
            case '<=': return score <= value;
            case '>': return score > value;
            case '<': return score < value;
            case '=': return score === value;
            default: return score >= value;
          }
        });
      }
      
      // Filter by comments with operator
      if (filters.comments !== null) {
        const { operator, value } = filters.comments;
        results = results.filter(question => {
          const count = question.comment_count;
          switch (operator) {
            case '>=': return count >= value;
            case '<=': return count <= value;
            case '>': return count > value;
            case '<': return count < value;
            case '=': return count === value;
            default: return count >= value;
          }
        });
      }
    }
    
    // Pagination
    const pageNumber = parseInt(page as string, 10);
    const pageSizeNumber = parseInt(pageSize as string, 10);
    const startIndex = (pageNumber - 1) * pageSizeNumber;
    const endIndex = pageNumber * pageSizeNumber;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    res.send({
      success: true,
      data: {
        questions: paginatedResults,
        total: results.length,
        page: pageNumber,
        pageSize: pageSizeNumber,
        filters: queryString ? parseSearchQuery(decodeURIComponent(queryString)) : null
      },
    });
  },
  
  // API gợi ý tìm kiếm
  'GET /api/questions/search/suggestions/:keyword': (req: any, res: any) => {
    const keyword = req.params.keyword || '';
    
    const suggestions = [];
    
    if (keyword) {
      const searchKeyword = decodeURIComponent(keyword).toLowerCase();
      
      // Gợi ý từ title của questions
      const titleSuggestions = questions
        .filter(q => q.title.toLowerCase().includes(searchKeyword))
        .slice(0, 3)
        .map(q => ({
          type: 'question',
          text: q.title,
          count: 1
        }));
      
      // Gợi ý tags
      const tagSuggestions = tags
        .filter(t => t.name.toLowerCase().includes(searchKeyword))
        .slice(0, 5)
        .map(t => ({
          type: 'tag',
          text: `[${t.name}]`,
          count: question_tags.filter(qt => qt.tag_id === t.id).length
        }));
      
      // Gợi ý users nếu keyword là số hoặc bắt đầu bằng "user:"
      if (/^\d+$/.test(searchKeyword) || searchKeyword.startsWith('user:')) {
        const userIdKeyword = searchKeyword.replace('user:', '');
        const userSuggestions = users
          .filter(user => {
            if (/^\d+$/.test(userIdKeyword)) {
              return user.id.toString().includes(userIdKeyword);
            }
            return user.username.toLowerCase().includes(userIdKeyword);
          })
          .slice(0, 3)
          .map(user => {
            const userQuestionCount = questions.filter(q => q.user_id === user.id).length;
            return {
              type: 'user',
              text: `user:${user.id}`,
              description: `Câu hỏi của ${user.username}`,
              count: userQuestionCount
            };
          });
        
        suggestions.push(...userSuggestions);
      }
      
      suggestions.push(...titleSuggestions, ...tagSuggestions);
    }
    
    res.send({
      success: true,
      data: suggestions
    });
  },

  // API xoá câu hỏi
  'DELETE /api/questions/:id': (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    const questionIndex = questions.findIndex(q => q.id === id);
    if (questionIndex === -1) {
      return res.status(404).send({ success: false, message: 'Không tìm thấy câu hỏi' });
    }
    // Xoá câu hỏi
    questions.splice(questionIndex, 1);
    // Xoá các answer liên quan
    for (let i = answers.length - 1; i >= 0; i--) {
      if (answers[i].question_id === id) answers.splice(i, 1);
    }
    // Xoá các comment liên quan đến answer của question này
    for (let i = comments.length - 1; i >= 0; i--) {
      const answer = answers.find(a => a.id === comments[i].answer_id);
      if (!answer || answer.question_id === id) comments.splice(i, 1);
    }
    // Xoá các vote liên quan đến question này
    for (let i = votes.length - 1; i >= 0; i--) {
      if (votes[i].question_id === id) votes.splice(i, 1);
    }
    // Xoá liên kết tag
    for (let i = question_tags.length - 1; i >= 0; i--) {
      if (question_tags[i].question_id === id) question_tags.splice(i, 1);
    }
    res.send({ success: true, message: 'Đã xoá câu hỏi', questions });
  },
};