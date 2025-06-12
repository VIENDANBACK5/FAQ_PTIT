import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getSavedQuestions, saveQuestion, unsaveQuestion, checkSaveStatus } from '@/services/SavedQuestion';
import { SavedQuestionWithDetails } from '@/services/SavedQuestion/typing';

export default () => {
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestionWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSavingQuestion, setIsSavingQuestion] = useState<boolean>(false);
  
  // Lấy danh sách câu hỏi đã lưu
  const fetchSavedQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSavedQuestions();
      console.log(result);
      if (result?.success && result.data) {
        setSavedQuestions(result.data);
      } else {
        message.error('Không thể tải danh sách câu hỏi đã lưu');
      }
    } catch (error) {
      console.error('Error fetching saved questions:', error);
      message.error('Đã có lỗi xảy ra khi tải danh sách câu hỏi đã lưu');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Kiểm tra trạng thái lưu câu hỏi
  const checkQuestionSaveStatus = useCallback(async (questionId: number) => {
    try {
      const result = await checkSaveStatus(questionId);
      if (result?.success && result.data) {
        setIsSaved(result.data.isSaved);
      }
    } catch (error) {
      console.error('Error checking save status:', error);
    }
  }, []);

  // Xử lý lưu/bỏ lưu câu hỏi
  const handleSaveQuestion = useCallback(async (id: number, user: any) => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để lưu câu hỏi');
      return;
    }

    setIsSavingQuestion(true);
    try {
      if (isSaved) {
        // Nếu đã lưu rồi thì bỏ lưu
        const result = await unsaveQuestion(id);
        if (result?.success) {
          setIsSaved(false);
          message.success('Đã bỏ lưu câu hỏi');
          
          // Cập nhật lại danh sách câu hỏi đã lưu nếu đang ở trang savedQuestions
          setSavedQuestions(prev => prev.filter(item => item.question.id !== id));
        }
      } else {
        // Nếu chưa lưu thì lưu
        const result = await saveQuestion(id);
        if (result?.success) {
          setIsSaved(true);
          message.success('Đã lưu câu hỏi thành công');
          
          // Có thể gọi fetchSavedQuestions() để cập nhật danh sách nếu đang ở trang savedQuestions
        }
      }
    } catch (error: any) {
      console.error('Error saving/unsaving question:', error);
      message.error(error?.data?.message || 'Không thể lưu câu hỏi. Vui lòng thử lại sau');
    } finally {
      setIsSavingQuestion(false);
    }
  }, [isSaved]);
  
  return {
    savedQuestions,
    loading,
    fetchSavedQuestions,
    isSaved,
    isSavingQuestion,
    handleSaveQuestion,
    checkQuestionSaveStatus,
  };
};