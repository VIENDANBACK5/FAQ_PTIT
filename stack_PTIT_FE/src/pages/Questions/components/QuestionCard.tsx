import React from "react";
import { Tag, Avatar, Typography, Space, Tooltip } from "antd";
import { Link } from "umi";
import { CheckCircleFilled, LockOutlined } from "@ant-design/icons";
import { Question } from "@/services/Questions/typing";

const { Title, Text } = Typography;

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const isClosed = question.status === "closed";

  function decodeHtmlEntities(str: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  const renderTags = () => {
    if (!question.tags || question.tags.length === 0) return null;

    return question.tags.map((tag, index) => {
      if (typeof tag === "string") {
        return isClosed ? (
          <Tag
            color="default"
            key={`new-tag-${index}`}
            className="cursor-not-allowed"
          >
            {tag}
          </Tag>
        ) : (
          <Link to={`/questions/tagged/${tag}`} key={`new-tag-${index}`}>
            <Tag color="blue">{tag}</Tag>
          </Link>
        );
      } else if (typeof tag === "object" && tag !== null) {
        return isClosed ? (
          <Tag
            color="default"
            key={tag.id || `tag-${index}`}
            className="cursor-not-allowed"
          >
            {tag.name}
          </Tag>
        ) : (
          <Link
            to={`/questions/tagged/${tag.name}`}
            key={tag.id || `tag-${index}`}
          >
            <Tag color="blue">{tag.name}</Tag>
          </Link>
        );
      }
      return null;
    });
  };

  return (
    <div
      className={`rounded-lg shadow-sm mb-4 flex relative p-4 transition-all duration-300 hover:shadow-md border border-[var(--border-color)] bg-[var(--bg-primary)] ${
        isClosed ? "opacity-40" : ""
      }`}
    >
      {isClosed && (
        <div className="top-2 right-2 absolute flex items-center px-2 py-1 rounded-md bg-[var(--text-secondary)] text-[var(--bg-primary)] text-xs">
          <LockOutlined className="mr-1" />
          Đã đóng
        </div>
      )}

      <div className="flex flex-col items-center mr-4 w-16 min-w-[4rem]">
        <div className="vote-count">
          <span
            className={`font-semibold text-lg ${
              question.upvotes - question.downvotes > 0
                ? "text-green-600"
                : question.upvotes - question.downvotes < 0
                  ? "text-red-500"
                  : ""
            }`}
          >
            {question.upvotes - question.downvotes}
          </span>
          <small className="block text-gray-500 text-xs">bình chọn</small>
        </div>

        <div
          className={`answer-count mt-2 rounded-lg transition-colors duration-200 p-1
          ${
            question.has_accepted_answer
              ? "border-[1px] border-green-500"
              : (question.answer_count ?? 0) > 0
                ? "border-[1px] border-green-300"
                : "border-none"
          }`}
          style={{
            backgroundColor: question.has_accepted_answer
              ? "rgba(34, 197, 94, 0.1)"
              : "transparent",
          }}
        >
          <div className="flex items-center">
            {question.has_accepted_answer ? (
              <Tooltip title="Câu hỏi này đã có câu trả lời được chấp nhận">
                <CheckCircleFilled className="mr-1 text-green-500" />
              </Tooltip>
            ) : null}
            <span className={`text-lg`}>{question.answer_count || 0}</span>
          </div>
          <small className="block text-gray-500 text-xs">câu trả lời</small>
        </div>

        <div className="mt-2 view-count">
          <span className="font-semibold text-lg">{question.views}</span>
          <small className="block text-gray-500 text-xs">lượt xem</small>
        </div>
      </div>

      <div className="flex-1">
        <Title level={5} className="mb-2 !text-[var(--text-primary)]">
          {isClosed ? (
            <Text className="!text-[var(--text-secondary)] cursor-not-allowed">
              {question.title}
            </Text>
          ) : (
            <Link
              to={`/question/${question.id}`}
              className="hover:opacity-80 !text-[var(--text-primary)] transition-opacity duration-200"
            >
              {question.title}
            </Link>
          )}
        </Title>

        <div className="mb-3 h-10 text-[var(--text-secondary)] text-sm line-clamp-2">
          {decodeHtmlEntities(
            question.content.replace(/<[^>]+>/g, "")
          ).substring(0, 200)}
          {question.content.length > 200 && "..."}
        </div>

        <Space size={[0, 8]} wrap className="mb-3">
          {renderTags()}
        </Space>

        <div className="flex justify-between items-center mb-2 text-sm">
          {isClosed ? (
            <span className="text-[var(--text-secondary)] cursor-not-allowed">
              {question.user?.username}
            </span>
          ) : (
            <Link
              to={`/users/${question.user?.id}/${question.user?.username?.replace(
                /\s+/g,
                "-"
              )}`}
              className="flex items-center hover:opacity-80 text-[var(--text-primary)] transition-opacity duration-200"
            >
              <Avatar
                src={question.user?.avatar}
                size="small"
                className="mr-1"
              />
              <span>{question.user?.username}</span>
            </Link>
          )}

          <div className="text-[var(--text-secondary)]">
            Đăng vào {question.created_at}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
