import React, { useEffect, useState, useRef } from 'react';
import { useParams, useModel, history, Link } from 'umi';
import { 
  Typography, 
  Button, 
  Spin, 
} from 'antd';

import QuestionHeader from './components/Detail/QuestionHeader';
import QuestionContent from './components/Detail/QuestionContent';
import AnswerList from './components/Detail/AnswerList';
import AnswerForm from './components/Detail/AnswerForm';

const { Title } = Typography;

const QuestionDetailPage = () => {
  const {
    question,
    loading,
    fetchQuestionDetail,
    handleVote,
    handleVoteAnswer,
    handleAcceptAnswer,
    handleSubmitAnswer,
    handleSubmitComment,
    toggleCommentForm,
    isSubmittingAnswer,
    commentForms,
    submittingComments,
  } = useModel('Question.questiondetail');
  
  // Sử dụng model savedQuestion
  const {
    isSaved,
    isSavingQuestion,
    handleSaveQuestion,
    checkQuestionSaveStatus
  } = useModel("savedQuestion");
  
  const { user } = useModel("user");
  const params = useParams<{ id: string }>();
  const questionId = parseInt(params.id || '0', 10); // Sửa lỗi Argument of type 'string | undefined'
  const editorRef = useRef<any>(null);

  // Fetch question detail on mount or when ID changes
  useEffect(() => {
    if (params.id && questionId > 0) {
      fetchQuestionDetail(questionId);
    }
  }, [params.id, fetchQuestionDetail, questionId]);

  useEffect(() => {
    // Kiểm tra trạng thái lưu khi component mount và user có sẵn
    if (questionId > 0 && user) {
      checkQuestionSaveStatus(questionId);
    }
  }, [questionId, user, checkQuestionSaveStatus]);

  // Hàm wrapper để phù hợp với interface
  const onVoteQuestion = (direction: "up" | "down") => {
    return handleVote(questionId, direction, user);
  };

  const onVoteAnswer = (answerId: number, direction: "up" | "down") => {
    return handleVoteAnswer(questionId, answerId, direction, user);
  };

  const onAcceptAnswer = (answerId: number) => {
    return handleAcceptAnswer(questionId, answerId, user);
  };

  const onSubmitComment = (answerId: number, values: any) => {
    return handleSubmitComment(questionId, answerId, values.content, user);
  };

  const onSubmitAnswer = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const success = await handleSubmitAnswer(questionId, content, user);
      if (success) {
        editorRef.current.setContent("");
      }
    }
  };

  // Xử lý lưu câu hỏi
  const onSaveQuestion = async () => {
    await handleSaveQuestion(questionId, user);
  };
  
  // Hiển thị loading spin khi đang tải
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  // Hiển thị thông báo nếu không tìm thấy câu hỏi
  if (!question) {
    return (
      <div className="py-20 text-center">
        <Title level={3}>Không tìm thấy câu hỏi này</Title>
        <Button type="primary" onClick={() => history.push("/questions")}>
          Quay lại danh sách câu hỏi
        </Button>
      </div>
    );
  }

  // Sắp xếp câu trả lời với kiểm tra null/undefined và sử dụng upvotes - downvotes thay vì score
  const sortedAnswers = (question.answers || []).sort((a, b) => {
    const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
    const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
    return scoreB - scoreA;
  });

  return (
    <div className="question-detail">
      {/* Tiêu đề và thông tin câu hỏi */}
      <QuestionHeader question={question} />

      {/* Nội dung câu hỏi */}
      <QuestionContent 
        question={question} 
        handleVote={onVoteQuestion}
        handleSave={onSaveQuestion}
        isSaved={isSaved}
        isSavingQuestion={isSavingQuestion} 
      />
      
      {/* Câu trả lời */}
      <AnswerList
        answers={sortedAnswers}
        questionId={questionId}
        questionUserId={question.user?.id || 0}
        currentUserId={user?.id || 0}
        answerCount={question.answer_count || 0}
        handleVoteAnswer={onVoteAnswer}
        handleAcceptAnswer={onAcceptAnswer}
        toggleCommentForm={toggleCommentForm}
        handleSubmitComment={onSubmitComment}
        commentForms={commentForms}
        submittingComments={submittingComments}
      />

      {/* Form thêm câu trả lời */}
      <AnswerForm
        isAuthenticated={!!user}
        isSubmitting={isSubmittingAnswer}
        handleSubmit={onSubmitAnswer}
        onEditorInit={(editor) => {
          editorRef.current = editor;
        }}
        questionUserId={question.user_id}
        currentUserId={user?.id || 0}
      />
    </div>
  );
};

export default QuestionDetailPage;