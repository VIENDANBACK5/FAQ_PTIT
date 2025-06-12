import React from "react";
import {
  Card,
  Button,
  Tooltip,
  Avatar,
  Typography,
  Form,
  Input,
  List,
} from "antd";
import { Link, useModel } from "umi";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleFilled,
  CommentOutlined,
} from "@ant-design/icons";
import { Answer } from "@/services/Answers/typing";
import { Comment } from "@/services/Comments/typing";

const { Text } = Typography;
const { TextArea } = Input;

interface AnswerCardProps {
  answer: Answer;
  questionId: number;
  questionUserId?: number;
  currentUserId?: number;
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

const AnswerCard: React.FC<AnswerCardProps> = ({
  answer,
  questionId,
  questionUserId,
  currentUserId,
  handleVoteAnswer,
  handleAcceptAnswer,
  toggleCommentForm,
  handleSubmitComment,
  commentForms,
  submittingComments,
}) => {  const isQuestionOwner = currentUserId && questionUserId === currentUserId;
  const isAnswerOwner = currentUserId && answer.user_id === currentUserId;

  return (
    <Card key={answer.id} className="mb-4 answer-card">
      <div className="flex">
        {/* Voting column */}
        <div className="flex flex-col items-center mr-4 w-[50px] voting">
          <Tooltip title="Bình chọn tích cực">
            <Button
              type="text"
              icon={<ArrowUpOutlined />}
              onClick={() => handleVoteAnswer(answer.id, "up")}
              className="vote-button"
              disabled={!!isAnswerOwner}
              title={
                isAnswerOwner
                  ? "Bạn không thể bình chọn câu trả lời của chính mình"
                  : ""
              }
            />
          </Tooltip>
          <div className="my-1 font-bold text-lg text-center vote-count">
            {answer.upvotes - answer.downvotes}
          </div>
          <Tooltip title="Bình chọn tiêu cực">
            <Button
              type="text"
              icon={<ArrowDownOutlined />}
              onClick={() => handleVoteAnswer(answer.id, "down")}
              className="vote-button"
              disabled={!!isAnswerOwner}
              title={
                isAnswerOwner
                  ? "Bạn không thể bình chọn câu trả lời của chính mình"
                  : ""
              }
            />
          </Tooltip>
          {answer.is_accepted && (
            <Tooltip title="Câu trả lời được chấp nhận">
              <CheckCircleFilled className="mt-2 text-green-500 text-2xl" />
            </Tooltip>
          )}
          {!answer.is_accepted && isQuestionOwner && (
            <Tooltip title="Chấp nhận câu trả lời này">
              <Button
                type="text"
                icon={<CheckCircleFilled />}
                onClick={() => handleAcceptAnswer(answer.id)}
                className="mt-2"
              />
            </Tooltip>
          )}
        </div>

        {/* Answer content */}
        <div className="flex-1">
          <div
            className="answer-content"
            dangerouslySetInnerHTML={{ __html: answer.content }}
          />

          <div className="flex justify-between items-center mt-4">
            <div>
              <Button
                type="text"
                icon={<CommentOutlined />}
                onClick={() => toggleCommentForm(answer.id)}
              >
                Thêm bình luận
              </Button>
            </div>
            <div className="bg-[var(--bg-primary)] p-3 rounded-md">
              <div className="text-gray-500 text-sm">
                Đã trả lời vào {answer.created_at}
              </div>
              <div className="flex items-center bg-[var(--bg-primary)] mt-2">
                <Avatar src={answer.user?.avatar} />
                <Link
                  to={`/users/${answer.user?.id}/${answer.user?.username.replace(
                    /\s+/g,
                    "-"
                  )}`}
                >
                  <Text strong className="ml-2 hover:text-[#1890ff]">
                    {answer.user?.username}
                  </Text>
                </Link>
              </div>
            </div>
          </div>

          {/* Comment form */}
          {commentForms[answer.id] && (
            <div className="mt-4">
              <Form
                layout="vertical"
                onFinish={(values) => handleSubmitComment(answer.id, values)}
              >
                <Form.Item
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập nội dung bình luận",
                    },
                  ]}
                >
                  <TextArea
                    rows={2}
                    placeholder="Nhập bình luận của bạn..."
                    maxLength={500}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submittingComments[answer.id]}
                  >
                    Thêm bình luận
                  </Button>
                  <Button
                    className="ml-2"
                    onClick={() => toggleCommentForm(answer.id)}
                  >
                    Hủy
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}

          {/* Comments */}
          {answer.comments && answer.comments.length > 0 && (
            <div className="bg-[var(--bg-primary)] mt-4 p-4 border-[var(--border-color)] rounded-md comments">
              <List
                itemLayout="horizontal"
                dataSource={answer.comments}
                renderItem={(comment: Comment) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={comment.user?.avatar} />}
                      title={
                        <Link
                          to={`/users/${comment.user?.id}/${comment.user?.username.replace(
                            /\s+/g,
                            "-"
                          )}`}
                        >
                          {comment.user?.username}
                        </Link>
                      }
                      description={
                        <>
                          <div>{comment.content}</div>
                          <Text type="secondary" className="text-xs">
                            {comment.created_at}
                          </Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AnswerCard;
