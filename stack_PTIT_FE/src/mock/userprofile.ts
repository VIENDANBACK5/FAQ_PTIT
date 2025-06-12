// Imports từ các mock data khác
import answers from './answers';
import { tags, question_tags } from './tags';
import { users } from './users';
import { questionsData } from "./questions"; 

// API lấy các câu hỏi của người dùng
const getQuestions = (req: any, res: any) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    // Kiểm tra xem userId có hợp lệ không
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID người dùng không hợp lệ'
      });
    }
    
    // Lấy câu hỏi của người dùng từ questionsArray
    const userQuestions = questionsData.filter((q: any) => q.user_id === userId);
    
    // Thêm thông tin tags và answer_count
    const questionsWithDetails = userQuestions.map((q: any) => {
      try {
        // Lấy thông tin tags dựa trên relation
        const questionTagIds = question_tags
          .filter((qt: any) => qt.question_id === q.id)
          .map((qt: any) => qt.tag_id);
        
        const questionTags = tags.filter((tag: any) => questionTagIds.includes(tag.id));
        
        // Đếm số câu trả lời cho câu hỏi này
        const answerCount = answers.filter((a: any) => a.question_id === q.id).length;
        
        // Thêm đối tượng user
        const user = users.find((u: any) => u.id === q.user_id);
        
        return {
          ...q,
          user,
          tags: questionTags,
          answer_count: answerCount
        };
      } catch (err) {
        console.error(`Lỗi xử lý câu hỏi ${q.id}:`, err);
        // Trả về câu hỏi gốc nếu xử lý lỗi
        return { ...q, tags: [], answer_count: 0 };
      }
    });
    
    res.json({
      success: true,
      data: questionsWithDetails
    });
  } catch (error) {
    console.error('Lỗi khi lấy câu hỏi của người dùng:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xử lý yêu cầu'
    });
  }
};

// API lấy các câu trả lời của người dùng
const getAnswers = (req: any, res: any) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    // Kiểm tra xem userId có hợp lệ không
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID người dùng không hợp lệ'
      });
    }
    
    const userAnswers = answers.filter((a: any) => a.user_id === userId);
    
    // Thêm thông tin về câu hỏi liên quan
    const answersWithDetails = userAnswers.map((answer: any) => {
      try {
        const relatedQuestion = questionsData.find((q: any) => q.id === answer.question_id);
        
        // Tìm người dùng nếu chưa có
        let user = answer.user;
        if (!user) {
          user = users.find((u: any) => u.id === answer.user_id);
        }
        
        return {
          ...answer,
          user,
          question_title: relatedQuestion?.title || `Câu hỏi #${answer.question_id}`,
          question_content: relatedQuestion?.content,
          comments: answer.comments || [] // Thông thường sẽ lấy comments từ database
        };
      } catch (err) {
        console.error(`Lỗi xử lý câu trả lời ${answer.id}:`, err);
        // Trả về câu trả lời gốc nếu xử lý lỗi
        return { 
          ...answer, 
          question_title: `Câu hỏi #${answer.question_id}`,
          comments: []
        };
      }
    });
    
    res.json({
      success: true,
      data: answersWithDetails
    });
  } catch (error) {
    console.error('Lỗi khi lấy câu trả lời của người dùng:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xử lý yêu cầu'
    });
  }
};

// API lấy các thẻ phổ biến của người dùng
const getTags = (req: any, res: any) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    // Kiểm tra xem userId có hợp lệ không
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID người dùng không hợp lệ'
      });
    }
      const userQuestions = questionsData.filter((q: any) => q.user_id === userId);
    
    // Lấy tất cả các question_id của người dùng
    const userQuestionIds = userQuestions.map((q: any) => q.id);
    
    // Lấy tất cả các tag_id từ question_tags của người dùng
    const userTagIds = question_tags
      .filter((qt: any) => userQuestionIds.includes(qt.question_id))
      .map((qt: any) => qt.tag_id);
    
    // Đếm số lần xuất hiện của mỗi tag
    const tagCounts = userTagIds.reduce((acc: Record<number, number>, tagId: number) => {
      acc[tagId] = (acc[tagId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // Lấy thông tin tag và thêm count
    const userTags = Object.entries(tagCounts)
      .map(([tagId, count]) => {
        try {
          const tag = tags.find((t: any) => t.id === parseInt(tagId, 10));
          if (tag) {
            return {
              ...tag,
              count
            };
          }
          return null;
        } catch (err) {
          console.error(`Lỗi xử lý tag ${tagId}:`, err);
          return null;
        }
      })
      .filter((tag): tag is any => tag !== null);
    
    res.json({
      success: true,
      data: userTags
    });
  } catch (error) {
    console.error('Lỗi khi lấy thẻ của người dùng:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xử lý yêu cầu'
    });
  }
};

// Xuất tất cả các API
export default {
  'GET /api/users/:id/questions': getQuestions,
  'GET /api/users/:id/answers': getAnswers,
  'GET /api/users/:id/tags': getTags
};
