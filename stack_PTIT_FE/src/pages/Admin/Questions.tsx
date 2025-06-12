import React from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Tag,
  Modal,
  Avatar,
  Descriptions,
  Typography,
} from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useModel } from "umi";

const { Text } = Typography;

const RecentPosts: React.FC = () => {
  const {
    isAnswerModalVisible,
    setIsAnswerModalVisible,
    isUserModalVisible,
    setIsUserModalVisible,
    isQuestionDetailModalVisible,
    setIsQuestionDetailModalVisible,
    selectedAnswers,
    selectedUser,
    selectedQuestion,
    data,
    loading,
    showAnswerModal,
    showUserModal,
    showQuestionDetailModal,
    handleDeleteQuestion,
  } = useModel("Admin.Question");

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center" as const,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 280,
      ellipsis: true,
      render: (text: string) => (
        <Text strong style={{ color: "#1890ff" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: 320,
      ellipsis: true,
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Tác giả",
      dataIndex: "user",
      key: "user",
      width: 160,
      align: "center" as const,
      render: (_: any, record: any) => {
        const user = record.user;
        if (!user) return null;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <Avatar
              src={user.avatar || ''}
              size={32}
              onClick={() => showUserModal({
                id: user.id,
                name: user.username,
                avatar: user.avatar || '',
              })}
              style={{ cursor: "pointer", border: "2px solid #1890ff" }}
            />
            <Text style={{ fontSize: "11px", textAlign: "center" }}>
              {user.username}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 240,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            style={{ borderRadius: "6px" }}
            onClick={() => showQuestionDetailModal(record)}
          >
            Xem
          </Button>
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            size="small"
            style={{ borderRadius: "6px" }}
            onClick={() => handleDeleteQuestion(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Danh sách bài viết gần đây"
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        headStyle={{
          backgroundColor: "#f0f5ff",
          color: "#1d39c4",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: 1,
            pageSize: 10,
            total: 30,
            size: "small",
            style: { marginTop: "16px" },
          }}
          rowClassName={() => "custom-row"}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
          scroll={{ x: 1060 }}
        />
      </Card>

      {/* Modal chi tiết câu hỏi */}
      <Modal
        title={
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "16px 20px",
              margin: "-20px -24px 20px -24px",
              borderRadius: "12px 12px 0 0",
              textAlign: "center",
            }}
          >
            <Text
              strong
              style={{
                fontSize: "20px",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <EyeOutlined />
              Chi tiết câu hỏi
            </Text>
          </div>
        }
        open={isQuestionDetailModalVisible}
        onCancel={() => setIsQuestionDetailModalVisible(false)}
        footer={null}
        width={900}
        style={{ top: 20 }}
        bodyStyle={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: "0px",
          borderRadius: "12px",
        }}
      >
        {selectedQuestion ? (
          <div style={{ padding: "24px" }}>
            {/* Header với ID và tiêu đề */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid #e8f4f8",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <Tag
                  color="blue"
                  style={{ fontSize: "12px", fontWeight: "bold" }}
                >
                  ID: {selectedQuestion.id}
                </Tag>
              </div>
              <Text
                strong
                style={{
                  fontSize: "24px",
                  color: "#1d39c4",
                  lineHeight: "1.4",
                  display: "block",
                }}
              >
                {selectedQuestion.title}
              </Text>
            </div>

            {/* Nội dung */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid #e8f4f8",
              }}
            >
              <Text
                strong
                style={{
                  fontSize: "16px",
                  color: "#595959",
                  marginBottom: "12px",
                  display: "block",
                }}
              >
                📄 Nội dung:
              </Text>
              <div
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#262626",
                  backgroundColor: "#f8f9fa",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                }}
              >
                {selectedQuestion.content}
              </div>
            </div>

            {/* Tags và Tác giả */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  flex: 1,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #e8f4f8",
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: "16px",
                    color: "#595959",
                    marginBottom: "12px",
                    display: "block",
                  }}
                >
                  🏷️ Tags:
                </Text>
                <Space size={8} wrap>
                  {(selectedQuestion.tags || []).map((tag) => (
                    <Tag
                      key={typeof tag === 'string' ? tag : tag.id}
                      color="geekblue"
                      style={{
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      {typeof tag === 'string' ? tag : tag.name}
                    </Tag>
                  ))}
                </Space>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  flex: 1,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #e8f4f8",
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: "16px",
                    color: "#595959",
                    marginBottom: "12px",
                    display: "block",
                  }}
                >
                  👤 Tác giả:
                </Text>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <Avatar
                    src={selectedQuestion.user?.avatar}
                    size={50}
                    style={{
                      border: "3px solid #1890ff",
                      cursor: "pointer",
                    }}
                    onClick={() => selectedQuestion.user && showUserModal({
                      id: selectedQuestion.user.id,
                      name: selectedQuestion.user.username,
                      avatar: selectedQuestion.user.avatar || '',
                    })}
                  />
                  <div>
                    <Text strong style={{ fontSize: "15px", display: "block" }}>
                      {selectedQuestion.user?.username}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Đăng ngày: {selectedQuestion.created_at}
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Thống kê */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid #e8f4f8",
              }}
            >
              <Text
                strong
                style={{
                  fontSize: "16px",
                  color: "#595959",
                  marginBottom: "16px",
                  display: "block",
                }}
              >
                📊 Thống kê:
              </Text>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#f6ffed",
                    borderRadius: "8px",
                    border: "1px solid #b7eb8f",
                    minWidth: "100px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#52c41a",
                    }}
                  >
                    {(selectedQuestion.upvotes || 0) - (selectedQuestion.downvotes || 0)}
                  </div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Lượt vote
                  </Text>
                </div>

                <div
                  style={{
                    padding: "12px 20px",
                    backgroundColor:
                      (selectedQuestion.answer_count || 0) > 0 ? "#e6f7ff" : "#f5f5f5",
                    borderRadius: "8px",
                    border:
                      (selectedQuestion.answer_count || 0) > 0
                        ? "1px solid #91d5ff"
                        : "1px solid #d9d9d9",
                    minWidth: "100px",
                    cursor:
                      (selectedQuestion.answer_count || 0) > 0 ? "pointer" : "default",
                  }}
                  onClick={() =>
                    (selectedQuestion.answer_count || 0) > 0 &&
                    showAnswerModal(selectedQuestion.answers || [])
                  }
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color:
                        (selectedQuestion.answer_count || 0) > 0
                          ? "#1890ff"
                          : "#8c8c8c",
                    }}
                  >
                    {selectedQuestion.answer_count || 0}
                  </div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Câu trả lời
                  </Text>
                </div>

                <div
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#fff7e6",
                    borderRadius: "8px",
                    border: "1px solid #ffd591",
                    minWidth: "100px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#fa8c16",
                    }}
                  >
                    {selectedQuestion.views}
                  </div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Lượt xem
                  </Text>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Không có thông tin câu hỏi.
            </Text>
          </div>
        )}
      </Modal>

      {/* Modal hiển thị danh sách câu trả lời */}
      <Modal
        title={
          <Text strong style={{ fontSize: "18px", color: "#1d39c4" }}>
            Danh sách câu trả lời
          </Text>
        }
        open={isAnswerModalVisible}
        onCancel={() => setIsAnswerModalVisible(false)}
        footer={null}
        style={{ borderRadius: "12px" }}
        bodyStyle={{
          backgroundColor: "#f0f5ff",
          padding: "24px",
          borderRadius: "12px",
        }}
      >
        {selectedAnswers.length > 0 ? (
          <div>
            {selectedAnswers.map((answer: any, index: number) => (
              <div
                key={answer.id}
                style={{
                  marginBottom: "24px",
                  padding: "16px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s",
                }}
              >
                <Descriptions
                  title={
                    <Text strong style={{ color: "#1d39c4" }}>
                      Câu trả lời {index + 1}
                    </Text>
                  }
                  column={1}
                  labelStyle={{ fontWeight: "bold", color: "#595959" }}
                  contentStyle={{ color: "#262626" }}
                >
                  <Descriptions.Item label="ID">{answer.id}</Descriptions.Item>
                  <Descriptions.Item label="Nội dung">
                    <Text style={{ color: "#595959" }}>{answer.content}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Người trả lời">
                    {answer.user?.username || answer.user?.name || "Ẩn danh"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày trả lời">
                    {answer.created_at || answer.createdAt}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượt vote">
                    <Text style={{ color: "#52c41a" }}>{(answer.upvotes || 0) - (answer.downvotes || 0) || answer.voteCount || 0}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Được chấp nhận">
                    <Tag color={answer.is_accepted || answer.isAccepted ? "green" : "red"}>
                      {(answer.is_accepted || answer.isAccepted) ? "Có" : "Không"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số bình luận">
                    {answer.comment_count || answer.commentCount || 0}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ))}
          </div>
        ) : (
          <Text type="secondary">Không có câu trả lời.</Text>
        )}
      </Modal>

      {/* Modal hiển thị hồ sơ người dùng */}
      <Modal
        title={
          <Text strong style={{ fontSize: "20px", color: "#1d39c4", letterSpacing: 1 }}>
            👤 Hồ sơ người dùng
          </Text>
        }
        open={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        footer={null}
        style={{ borderRadius: "16px" }}
        bodyStyle={{
          background: "linear-gradient(135deg, #f0f5ff 0%, #e6eafc 100%)",
          padding: "32px 0 24px 0",
          borderRadius: "16px",
        }}
      >
        {selectedUser ? (
          <div style={{ textAlign: "center" }}>
            <Avatar
              src={selectedUser.avatar}
              size={96}
              style={{ marginBottom: 20, border: "3px solid #1890ff", boxShadow: "0 2px 12px #b3c6ff55" }}
            />
            <Text strong style={{ fontSize: 22, color: "#1d39c4", display: "block", marginBottom: 4 }}>
              {selectedUser.username}
            </Text>
            <Text type="secondary" style={{ fontSize: 15, marginBottom: 16, display: "block" }}>
              {selectedUser.title || selectedUser.role}
            </Text>
            <Descriptions
              column={1}
              labelStyle={{
                fontWeight: "bold",
                color: "#595959",
                fontSize: "15px",
                width: 120,
              }}
              contentStyle={{ color: "#262626", fontSize: "15px" }}
              style={{ maxWidth: 340, margin: "0 auto", background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px #b3c6ff22" }}
            >
              {selectedUser.email && (
                <Descriptions.Item label="Email">
                  <span style={{ color: "#1d39c4" }}>{selectedUser.email}</span>
                </Descriptions.Item>
              )}
              {selectedUser.bio && (
                <Descriptions.Item label="Giới thiệu">
                  <span style={{ fontStyle: "italic" }}>{selectedUser.bio}</span>
                </Descriptions.Item>
              )}
              {selectedUser.reputation !== undefined && (
                <Descriptions.Item label="Điểm uy tín">
                  <span style={{ color: "#52c41a", fontWeight: 600 }}>{selectedUser.reputation}</span>
                </Descriptions.Item>
              )}
              {selectedUser.role && (
                <Descriptions.Item label="Vai trò">
                  {selectedUser.role === 'admin' ? 'Quản trị viên' : selectedUser.role === 'teacher' ? 'Giảng viên' : 'Sinh viên'}
                </Descriptions.Item>
              )}
              {selectedUser.created_at && (
                <Descriptions.Item label="Ngày tham gia">
                  {selectedUser.created_at}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        ) : (
          <Text type="secondary">Không có thông tin người dùng.</Text>
        )}
      </Modal>

      {/* CSS tùy chỉnh */}
      <style>
        {`
          .custom-row:hover {
            background-color: #f5f7fa !important;
            transition: background-color 0.3s;
          }
          .custom-row td {
            padding: 12px !important;
            font-size: 14px !important;
          }
          .ant-table-thead th {
            background-color: #f0f5ff !important;
            color: #1d39c4 !important;
            font-weight: bold !important;
            border-bottom: 2px solid #d9e4ff !important;
          }
          .ant-table-tbody td {
            border-bottom: 1px solid #f0f0f0 !important;
          }
        `}
      </style>
    </div>
  );
};

export default RecentPosts;
