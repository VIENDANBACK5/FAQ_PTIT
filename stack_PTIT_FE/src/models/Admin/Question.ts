import { useState, useEffect } from "react";
import { getQuestions, deleteQuestion } from "@/services/Questions";
import { useModel } from "umi";
import { users as mockUsers } from "@/mock/users";
import { Question } from "@/services/Questions/typing";

export default () => {
  const [isAnswerModalVisible, setIsAnswerModalVisible] = useState(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isQuestionDetailModalVisible, setIsQuestionDetailModalVisible] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const userModel = useModel('user');

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const result = await getQuestions({ page: 1, pageSize: 20, sort: "newest" });
        if (result?.success) {
          const sorted = result.data.list.slice().sort((a, b) => a.id - b.id);
          setData(sorted);
        }
      } catch (error) {
        // handle error if needed
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const showAnswerModal = (answers: any[]) => {
    setSelectedAnswers(answers);
    setIsAnswerModalVisible(true);
  };

  const showUserModal = (user: { id: number; name?: string; username?: string; avatar: string }) => {
    setSelectedUser({
      id: user.id,
      username: user.name || user.username || '',
      avatar: user.avatar || '',
    });
    setIsUserModalVisible(true);
  };

  const showQuestionDetailModal = (question: Question) => {
    setSelectedQuestion(question);
    setIsQuestionDetailModalVisible(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await deleteQuestion(id);
      setData(prev => prev.filter(q => q.id !== id));
      // Optionally: gọi lại getQuestions để đồng bộ dữ liệu mới nhất
      // const result = await getQuestions({ page: 1, pageSize: 20, sort: "newest" });
      // if (result?.success) setData(result.data.list);
    } catch (err: any) {
      // Hiển thị lỗi nếu cần
    }
  };

  return {
    isAnswerModalVisible,
    setIsAnswerModalVisible,
    isUserModalVisible,
    setIsUserModalVisible,
    isQuestionDetailModalVisible,
    setIsQuestionDetailModalVisible,
    selectedAnswers,
    setSelectedAnswers,
    selectedUser,
    setSelectedUser,
    selectedQuestion,
    setSelectedQuestion,
    data,
    setData,
    loading,
    showAnswerModal,
    showUserModal,
    showQuestionDetailModal,
    handleDeleteQuestion,
    userModel,
  };
}
