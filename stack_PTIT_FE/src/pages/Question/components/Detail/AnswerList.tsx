import React from "react";
import { Typography, Card } from "antd";
import { Answer } from "@/services/Answers/typing";
import AnswerCard from "./AnswerCard";

const { Title, Text } = Typography;

interface AnswerListProps {
  answers: Answer[];
  questionId: number;
  questionUserId?: number;
  currentUserId?: number;
  answerCount: number;
  handleVoteAnswer: (
    answerId: number,
    direction: "up" | "down"
  ) => Promise<void>;
  handleAcceptAnswer: (answerId: number) => Promise<void>;
  toggleCommentForm: (answerId: number) => void;
  handleSubmitComment: (answerId: number, values: any) => Promise<void>;
  commentForms: { [key: number]: boolean };
  submittingComments: { [key: number]: boolean };
}

const AnswerList: React.FC<AnswerListProps> = ({
  answers,
  questionId,
  questionUserId,
  currentUserId,
  answerCount,
  handleVoteAnswer,
  handleAcceptAnswer,
  toggleCommentForm,
  handleSubmitComment,
  commentForms,
  submittingComments,
}) => {
  return (
    <div className="mt-8 answers">
      <Title level={4}>{answerCount} Câu trả lời</Title>

      {answers.length > 0 ? (
        <div className="answer-list">
          {answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              questionId={questionId}
              questionUserId={questionUserId}
              currentUserId={currentUserId}
              handleVoteAnswer={handleVoteAnswer}
              handleAcceptAnswer={handleAcceptAnswer}
              toggleCommentForm={toggleCommentForm}
              handleSubmitComment={handleSubmitComment}
              commentForms={commentForms}
              submittingComments={submittingComments}
            />
          ))}
        </div>
      ) : (
        <Card>
          <div className="py-6 text-center">
            <Text type="secondary">Chưa có câu trả lời cho câu hỏi này</Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnswerList;
