import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { history } from "umi";
import {
  getQuestionDetail,
  voteQuestion,
  voteAnswer,
  acceptAnswer,
  createAnswer,
  createComment,
} from "@/services/Questions";
import { Question } from "@/services/Questions/typing";
import { Answer } from "@/services/Answers/typing";

export default () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [commentForms, setCommentForms] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [submittingComments, setSubmittingComments] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );

  // Fetch question detail
  const fetchQuestionDetail = useCallback(
    async (id: number) => {
      if (id === currentQuestionId && question) {
        return; // Tránh fetch lại nếu ID không thay đổi và question đã có data
      }

      setLoading(true);
      try {
        const result = await getQuestionDetail(id);
        if (result?.success) {
          setQuestion(result.data);
          setCurrentQuestionId(id);
        } else {
          message.error("Không thể tải thông tin câu hỏi");
        }
      } catch (error) {
        console.error("Error fetching question details:", error);
        message.error("Đã xảy ra lỗi khi tải thông tin câu hỏi");
      } finally {
        setLoading(false);
      }
    },
    [currentQuestionId, question]
  );

  // Handle vote question
  const handleVote = async (
    id: number,
    direction: "up" | "down",
    user: any
  ) => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để bình chọn");
      return;
    }
    
    // Kiểm tra xem người dùng có phải là người đặt câu hỏi không
    if (question && question.user_id === user.id) {
      message.warning("Bạn không thể bình chọn câu hỏi của chính mình");
      return;
    }    try {
      const result = await voteQuestion(id, direction);
      if (result?.success) {
        // Preserve the existing answers when updating the question state
        if (question && question.answers) {
          setQuestion({...result.data, answers: question.answers});
        } else {
          setQuestion(result.data);
        }
        
        message.success(
          direction === "up"
            ? "Đã bình chọn tích cực cho câu hỏi"
            : "Đã bình chọn tiêu cực cho câu hỏi"
        );
      }
    } catch (error: any) {
      console.error("Error voting question:", error);
      message.error(error?.data?.message || "Không thể bình chọn. Vui lòng thử lại sau");
    }
  };
  // Handle vote answer
  const handleVoteAnswer = async (
    questionId: number,
    answerId: number,
    direction: "up" | "down",
    user: any
  ) => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để bình chọn");
      return;
    }
    
    // Kiểm tra xem người dùng có phải là người tạo câu trả lời không
    const answer = question?.answers?.find((a: any) => a.id === answerId);
    if (answer && answer.user_id === user.id) {
      message.warning("Bạn không thể bình chọn câu trả lời của chính mình");
      return;
    }

    try {
      const result = await voteAnswer(questionId, answerId, direction);
      if (result?.success) {
        // Cập nhật câu trả lời trong state
        if (question && question.answers) {
          const updatedAnswers = question.answers.map((a: Answer) =>
            a.id === answerId ? result.data : a
          );
          setQuestion({ ...question, answers: updatedAnswers });
        }

        message.success(
          direction === "up"
            ? "Đã bình chọn tích cực cho câu trả lời"
            : "Đã bình chọn tiêu cực cho câu trả lời"
        );
      }
    } catch (error: any) {
      console.error("Error voting answer:", error);
      message.error(error?.data?.message || "Không thể bình chọn. Vui lòng thử lại sau");
    }
  };
  
  // Handle accept answer
  const handleAcceptAnswer = async (
    questionId: number,
    answerId: number,
    user: any
  ) => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để chấp nhận câu trả lời");
      return;
    }

    try {
      const result = await acceptAnswer(questionId, answerId);
      if (result?.success) {
        // Cập nhật tất cả câu trả lời trong state
        if (question && question.answers) {
          const updatedAnswers = question.answers.map((a: Answer) => {
            if (a.id === answerId) {
              return { ...a, is_accepted: true };
            }
            return { ...a, is_accepted: false };
          });
          setQuestion({ ...question, answers: updatedAnswers });
        }

        message.success("Đã chấp nhận câu trả lời");
      }
    } catch (error) {
      console.error("Error accepting answer:", error);
      message.error("Không thể chấp nhận câu trả lời. Vui lòng thử lại sau");
    }
  };

  // Handle submit answer
  const handleSubmitAnswer = async (
    questionId: number,
    content: string,
    user: any
  ) => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để trả lời");
      history.push("/auth/login");
      return false;
    }

    // Kiểm tra xem người dùng có phải là người đặt câu hỏi không
    if (question && question.user_id === user.id) {
      message.warning("Bạn không thể tự trả lời câu hỏi của chính mình");
      return false;
    }

    if (!content || content.length < 30) {
      message.error("Câu trả lời phải có ít nhất 30 ký tự");
      return false;
    }

    setIsSubmittingAnswer(true);
    try {
      const result = await createAnswer(questionId, content);
      if (result?.success) {
        message.success("Đã thêm câu trả lời thành công");
        // Cập nhật state với câu trả lời mới
        if (question) {
          const newAnswers = question.answers
            ? [...question.answers, result.data]
            : [result.data];
          setQuestion({
            ...question,
            answers: newAnswers,
            answer_count: (question.answer_count || 0) + 1,
          });
        }
        return true;
      } else {
        message.error("Không thể thêm câu trả lời");
        return false;
      }
    } catch (error) {
      console.error("Error creating answer:", error);
      message.error("Đã xảy ra lỗi khi thêm câu trả lời");
      return false;
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Toggle comment form
  const toggleCommentForm = (answerId: number) => {
    setCommentForms((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));
  };

  // Handle submit comment
  const handleSubmitComment = async (
    questionId: number,
    answerId: number,
    content: string,
    user: any
  ) => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để bình luận");
      history.push("/auth/login");
      return;
    }

    setSubmittingComments((prev) => ({ ...prev, [answerId]: true }));
    try {
      let result;
      if (answerId > 0) {
        // Bình luận cho answer
        result = await createComment(0, 0, answerId, content);
      } else {
        // Bình luận cho question
        result = await createComment(0, questionId, 0, content);
      }
      if (result?.success) {
        message.success("Đã thêm bình luận thành công");

        // Cập nhật state với bình luận mới
        if (question && question.answers) {
          const updatedAnswers = question.answers.map((a) => {
            if (a.id === answerId) {
              const comments = a.comments
                ? [...a.comments, result.data]
                : [result.data];
              return {
                ...a,
                comments,
                comment_count: (a.comment_count || 0) + 1,
              };
            }
            return a;
          });
          setQuestion({ ...question, answers: updatedAnswers });
        }

        // Reset form và đóng form
        setCommentForms((prev) => ({ ...prev, [answerId]: false }));
      } else {
        message.error("Không thể thêm bình luận");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      message.error("Đã xảy ra lỗi khi thêm bình luận");
    } finally {
      setSubmittingComments((prev) => ({ ...prev, [answerId]: false }));
    }
  };

  // Sắp xếp câu trả lời
  const getSortedAnswers = () => {
    if (!question || !question.answers) return [];

    return [...question.answers].sort((a, b) => {
      if (a.is_accepted) return -1;
      if (b.is_accepted) return 1;
      return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
    });
  };

  // Reset state khi unmount hoặc khi đổi câu hỏi
  useEffect(() => {
    return () => {
      setCommentForms({});
      setSubmittingComments({});
    };
  }, [currentQuestionId]);

  return {
    question,
    loading,
    isSubmittingAnswer,
    commentForms,
    submittingComments,
    fetchQuestionDetail,
    handleVote,
    handleVoteAnswer,
    handleAcceptAnswer,
    handleSubmitAnswer,
    toggleCommentForm,
    handleSubmitComment,
    getSortedAnswers,
  };
};
