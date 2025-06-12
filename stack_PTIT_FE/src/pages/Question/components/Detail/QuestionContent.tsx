import React from "react";
import { Card, Space, Tag, Avatar, Typography, Button, Tooltip } from "antd";
import { Link, useModel } from "umi";
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  SaveOutlined,
  SaveFilled
} from "@ant-design/icons";
import { Question } from "@/services/Questions/typing";

const { Text } = Typography;

interface QuestionContentProps {
  question: Question;
  handleVote: (direction: "up" | "down") => Promise<void>;
  handleSave: () => Promise<void>;  // Thêm props cho chức năng lưu
  isSaved: boolean;                 // Trạng thái đã lưu
  isSavingQuestion: boolean;        // Trạng thái đang lưu
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  handleVote,
  handleSave,
  isSaved,
  isSavingQuestion
}) => {
  const { user } = useModel('user');
  const isQuestionOwner = user && question.user_id === user.id;
  
  // Xử lý trường hợp tags có thể là string[] hoặc object[]
  const renderTags = () => {
    if (!question.tags || question.tags.length === 0) return null;
    
    return question.tags.map((tag, index) => {
      // Nếu tag là string (tag mới tạo)
      if (typeof tag === 'string') {
        return (
          <Link to={`/questions/tagged/${tag}`} key={`new-tag-${index}`}>
            <Tag color="blue">
              {tag}
            </Tag>
          </Link>
        );
      } 
      // Nếu tag là object (tag có sẵn)
      else if (typeof tag === 'object' && tag !== null) {
        return (
          <Link to={`/questions/tagged/${tag.name}`} key={tag.id || `tag-${index}`}>
            <Tag color="blue">
              {tag.name}{" "}
              {tag.count !== undefined && (
                <span className="text-xs">({tag.count})</span>
              )}
            </Tag>
          </Link>
        );
      }
      return null;
    });
  };

  return (
    <div className="flex">
      {/* Cột voting bên trái */}
      <div className="flex flex-col items-center mr-4 w-[50px] voting">
        <Button
          type="text"
          icon={<ArrowUpOutlined />}
          onClick={() => handleVote("up")}
          disabled={isQuestionOwner}
          title={
            isQuestionOwner
              ? "Bạn không thể bình chọn câu hỏi của chính mình"
              : ""
          }
          className="vote-button"
        />
        <div className="my-1 font-bold text-lg text-center vote-count">
          {question.upvotes - question.downvotes}
        </div>
        <Button
          type="text"
          icon={<ArrowDownOutlined />}
          onClick={() => handleVote("down")}
          disabled={isQuestionOwner}
          title={
            isQuestionOwner
              ? "Bạn không thể bình chọn câu hỏi của chính mình"
              : ""
          }
          className="vote-button"
        />
        <Tooltip title={isSaved ? "Bỏ lưu câu hỏi" : "Lưu câu hỏi này"}>
          <Button
            type="text"
            icon={
              isSaved ? (
                <SaveFilled style={{ color: "#1890ff" }} />
              ) : (
                <SaveOutlined />
              )
            }
            className="vote-button"
            style={{ marginTop: "10px" }}
            onClick={handleSave}
            loading={isSavingQuestion}
          />
        </Tooltip>
      </div>

      {/* Nội dung câu hỏi bên phải */}
      <div className="flex-1">
        <Card className="mb-6">
          <div className="content-wrapper">
            <div
              className="question-content"
              dangerouslySetInnerHTML={{ __html: question.content }}
            />
          </div>
          <Space className="mt-4" size={[0, 8]} wrap>
            {renderTags()}
          </Space>

          <div className="flex justify-end bg-[var(--bg-primary)] mt-4">
            <div className="bg-[var(--bg-primary)] p-3 rounded-md">
              <div className="text-gray-500 text-sm">
                Đã hỏi vào {question.created_at}
              </div>
              <div className="flex items-center mt-2">
                <Avatar src={question.user?.avatar} />
                <Link
                  to={`/users/${question.user?.id}/${question.user?.username?.replace(/\s+/g, "-")}`}
                >
                  <Text strong className="ml-2 hover:text-[#1890ff]">
                    {question.user?.username || "Người dùng ẩn danh"}
                  </Text>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuestionContent;
