import {
  Statistic,
  Row,
  Col,
  List,
  Tag as AntTag,
  Space,
  Tabs,
  Typography,
  Spin,
  Tooltip,
} from "antd";
import { Link, useModel } from "umi";
import React, { useEffect } from "react";
import { User } from "@/services/Users/typing";
import { Question } from "@/services/Questions/typing";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  QuestionCircleOutlined,
  CommentOutlined,
  TagOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Text, Title } = Typography;

interface ProfileProps {
  user?: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { questions, answers, tags, loading, fetchUserData } =
    useModel("profile");

  useEffect(() => {
    if (user?.id) {
      fetchUserData(user.id);
    }
  }, [user?.id, fetchUserData]);

  if (!user) {
    return (
      <div className="text-primary">
        Không có thông tin người dùng
      </div>
    );
  }

  const questionVotes = questions.reduce((acc, question) => {
    return acc + (question.upvotes - question.downvotes);
  }, 0);

  return (
    <div className="flex md:flex-row flex-col">
      <div className="mr-4 mb-6 md:mb-0 w-full md:w-1/4">
        <h1 className="mb-2 text-primary text-2xl">Trạng thái</h1>
        <div className="bg-[var(--bg-primary)] bg-primary mb-2 p-4 border theme-border border-border rounded-lg">
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Danh tiếng"
                value={user?.reputation || 0}
                valueStyle={{ color: "var(--text-primary)" }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Câu hỏi"
                value={questions.length}
                valueStyle={{ color: "var(--text-primary)" }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Câu trả lời"
                value={answers.length}
                valueStyle={{ color: "var(--text-primary)" }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Thẻ"
                value={tags.length}
                valueStyle={{ color: "var(--text-primary)" }}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className="w-full md:w-3/4">
        <div className="mb-4">
          <h1 className="mb-2 text-primary text-2xl">Giới thiệu</h1>
          <div className="bg-[var(--bg-primary)] bg-primary mb-2 p-4 border theme-border border-border rounded-lg">
            <p className="text-primary">
              {user?.bio || "Chưa có thông tin giới thiệu"}
            </p>
          </div>
        </div>

        <Tabs defaultActiveKey="questions">
          <TabPane
            tab={
              <span>
                <QuestionCircleOutlined /> Câu hỏi ({questions.length})
              </span>
            }
            key="questions"
          >
            <Spin spinning={loading.questions}>
              <List
                dataSource={questions}
                locale={{ emptyText: "Người dùng chưa có bài đăng nào" }}
                renderItem={(question: Question) => (
                  <List.Item
                    key={question.id}
                    className="bg-[var(--bg-primary)] hover:shadow-md mb-2 rounded-lg transition-all duration-200"
                  >
                    <div className="px-4 py-2 w-full">
                      <Link
                        to={`/question/${question.id}`}
                        className="hover:opacity-80 font-medium text-primary text-lg transition-opacity duration-200"
                      >
                        {question.title}
                      </Link>

                      <div className="mt-2 mb-2">
                        {question.tags?.map((tag) => (
                          <AntTag key={tag.id} className="mr-1">
                            <Link
                              to={`/questions/tagged/${tag.name}`}
                              className="text-inherit"
                            >
                              {tag.name}
                            </Link>
                          </AntTag>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <Space>
                            <Tooltip
                              title={`Tiêu cực: ${question.upvotes} - Tích cực: ${question.downvotes}`}
                            >
                              <AntTag color="blue">
                                {question.upvotes - question.downvotes} votes
                              </AntTag>
                            </Tooltip>

                            <AntTag color="green">
                              {question.answer_count || 0} câu trả lời
                            </AntTag>
                            <AntTag color="orange">
                              {question.views} lượt xem
                            </AntTag>
                          </Space>
                        </div>

                        <span className="text-secondary">
                          Đăng{" "}
                          {formatDistanceToNow(new Date(question.created_at), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Spin>
          </TabPane>
          <TabPane
            tab={
              <span>
                <CommentOutlined /> Câu trả lời ({answers.length})
              </span>
            }
            key="answers"
          >
            <Spin spinning={loading.answers}>
              <List
                dataSource={answers}
                locale={{ emptyText: "Người dùng chưa có câu trả lời nào" }}
                renderItem={(answer: any) => (
                  <List.Item
                    key={answer.id}
                    className="bg-[var(--bg-primary)] bg-primary border-[var(--border-color)] transition-all duration-200"
                  >
                    <div className="px-4 py-2 w-full">
                      <Link
                        to={`/question/${answer.question_id}`}
                        className="hover:opacity-80 font-medium text-primary text-lg transition-opacity duration-200"
                      >
                        {answer.question_title ||
                          `Câu trả lời cho câu hỏi #${answer.question_id}`}
                      </Link>

                      <div className="mt-2">
                        <div
                          className="bg-secondary p-2 rounded-md text-secondary"
                          dangerouslySetInnerHTML={{
                            __html:
                              answer.content?.length > 200
                                ? `${answer.content.substring(0, 200)}...`
                                : answer.content,
                          }}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <Space>
                          <AntTag color="blue">
                            {answer.upvotes - answer.downvotes} votes
                          </AntTag>
                          <AntTag color="cyan">
                            {answer.comments?.length || 0} bình luận
                          </AntTag>
                          {answer.is_accepted && (
                            <AntTag color="green">Đã chấp nhận</AntTag>
                          )}
                        </Space>
                        <span className="text-secondary">
                          Trả lời{" "}
                          {formatDistanceToNow(new Date(answer.created_at), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Spin>
          </TabPane>
          <TabPane
            tab={
              <span>
                <TagOutlined /> Thẻ liên quan ({tags.length})
              </span>
            }
            key="tags"
          >
            <Spin spinning={loading.tags}>
              <div className="flex flex-wrap gap-4 p-4">
                {tags.length > 0 ? (
                  tags.map((tag: any) => (  
                    <div
                      key={tag.id}
                      className="flex-1 bg-[var(--bg-primary)] bg-secondary hover:shadow-md p-4 rounded-lg min-w-[200px] transition-all duration-200"
                    >
                      <Link
                        to={`/questions/tagged/${tag.name}`}
                        className="hover:opacity-80 font-medium text-primary text-lg transition-opacity duration-200"
                      >
                        {tag.name}
                      </Link>
                      <div className="mt-2">
                        <AntTag color="blue">{tag.count || 0} bài đăng</AntTag>
                        {tag.description && (
                          <div className="mt-2 text-secondary text-sm">
                            {tag.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 w-full text-secondary text-center">
                    Người dùng chưa có thẻ nào
                  </div>
                )}
              </div>
            </Spin>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
