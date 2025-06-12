import { Question } from '@/services/Questions/typing';
import { users } from './users';
import { questionsData } from './questions';
import { tags } from './tags';
import { question_tags } from './tags';
import { SavedQuestion } from '@/services/SavedQuestion/typing';
import { format } from 'date-fns';

// Dữ liệu mẫu cho savedQuestions
export const savedQuestions: SavedQuestion[] = [
  {
    id: 1,
    user_id: 1,  // sinh viên 1
    question_id: 2,
    saved_at: "2023-10-10T10:00:00Z"
  },
  {
    id: 2,
    user_id: 4,  // sinh viên 2
    question_id: 1,
    saved_at: "2023-10-15T14:30:00Z"
  },
  {
    id: 3,
    user_id: 2,  // giảng viên
    question_id: 3,
    saved_at: "2023-11-01T08:45:00Z"
  }
];

// Biến đếm cho ID mới
let nextSavedQuestionId = savedQuestions.length + 1;

export default {
  // API lưu câu hỏi
  'POST /api/questions/:id/save': (req: any, res: any) => {
    const questionId = parseInt(req.params.id, 10);
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để lưu câu hỏi',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    const question = questionsData.find(q => q.id === questionId);
    
    if (!question) {
      return res.status(404).send({
        success: false,
        message: 'Không tìm thấy câu hỏi',
      });
    }
    
    // Kiểm tra xem người dùng đã lưu câu hỏi này chưa
    const existingSave = savedQuestions.find(s => s.user_id === userId && s.question_id === questionId);
    
    if (existingSave) {
      return res.status(400).send({
        success: false,
        message: 'Câu hỏi này đã được lưu trước đó',
      });
    }
      // Tạo bản ghi lưu câu hỏi mới
    const now = format(new Date(), 'yyyy-MM-dd'); // Format date as YYYY-MM-DD
    const savedQuestion: SavedQuestion = {
      id: nextSavedQuestionId++,
      user_id: userId,
      question_id: questionId,
      saved_at: now
    };
    
    savedQuestions.push(savedQuestion);
    
    res.send({
      success: true,
      message: 'Đã lưu câu hỏi thành công',
      data: {
        ...savedQuestion,
        question: {
          id: question.id,
          title: question.title
        }
      }
    });
  },
  
  // API bỏ lưu câu hỏi
  'DELETE /api/questions/:id/save': (req: any, res: any) => {
    const questionId = parseInt(req.params.id, 10);
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để bỏ lưu câu hỏi',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    
    // Kiểm tra xem người dùng đã lưu câu hỏi này chưa
    const existingSaveIndex = savedQuestions.findIndex(s => s.user_id === userId && s.question_id === questionId);
    
    if (existingSaveIndex === -1) {
      return res.status(404).send({
        success: false,
        message: 'Bạn chưa lưu câu hỏi này',
      });
    }
    
    // Xóa bản ghi lưu câu hỏi
    savedQuestions.splice(existingSaveIndex, 1);
    
    res.send({
      success: true,
      message: 'Đã bỏ lưu câu hỏi thành công'
    });
  },
  
  // API lấy danh sách câu hỏi đã lưu của người dùng
  'GET /api/users/me/saved-questions': (req: any, res: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để xem danh sách câu hỏi đã lưu',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    
    // Lấy danh sách câu hỏi đã lưu của người dùng
    const userSavedQuestions = savedQuestions.filter(s => s.user_id === userId);
    
    // Lấy thông tin chi tiết của các câu hỏi đã lưu
    const savedQuestionsWithDetails = userSavedQuestions.map(saved => {
      const question = questionsData.find(q => q.id === saved.question_id);
      
      if (!question) {
        return null;  // Câu hỏi đã bị xóa
      }
      
      // Lấy thông tin người dùng đặt câu hỏi
      const user = users.find(u => u.id === question.user_id);
      
      // Lấy danh sách tags của câu hỏi
      const questionTags = tags.filter(t => 
        question_tags.some(qt => qt.question_id === question.id && qt.tag_id === t.id)
      );
      
      return {
        saved_id: saved.id,
        saved_at: saved.saved_at,
        question: {
          ...question,
          user,
          tags: questionTags
        }
      };
    }).filter(item => item !== null);  // Lọc bỏ các câu hỏi đã bị xóa
    
    res.send({
      success: true,
      data: savedQuestionsWithDetails
    });
  },

  // API kiểm tra trạng thái lưu của câu hỏi
  'GET /api/questions/:id/save-status': (req: any, res: any) => {
    const questionId = parseInt(req.params.id, 10);
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !token.startsWith('mock-token-')) {
      return res.status(401).send({
        success: false,
        message: 'Bạn cần đăng nhập để kiểm tra trạng thái lưu',
      });
    }
    
    const userId = parseInt(token.replace('mock-token-', ''), 10);
    
    // Kiểm tra xem người dùng đã lưu câu hỏi này chưa
    const isSaved = savedQuestions.some(s => s.user_id === userId && s.question_id === questionId);
    
    res.send({
      success: true,
      data: {
        isSaved
      }
    });
  }
};
