import React from "react";
import { Typography } from "antd";
import {
  EyeOutlined,
  MessageOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Question } from "@/services/Questions/typing";

const { Title } = Typography;

interface QuestionHeaderProps {
  question: Question;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({ question }) => {
  return (
    <div className="mb-6">
      <Title level={2}>{question.title}</Title>
      <div className="flex items-center mb-4 text-gray-500 text-sm">
        <div className="flex items-center mr-4">
          <EyeOutlined className="mr-1" />
          {question.views} lượt xem
        </div>
        <div className="flex items-center mr-4">
          <MessageOutlined className="mr-1" />
          {question.answer_count} trả lời
        </div>
        <div className="flex items-center">
          <ClockCircleOutlined className="mr-1" />
          {question.created_at}
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
