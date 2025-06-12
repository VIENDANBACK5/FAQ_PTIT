// src/pages/Profile/components/Saves.tsx
import React, { useEffect } from 'react';
import { Card, List, Tag, Space, Typography, Empty, Breadcrumb, Button } from 'antd';
import { Link, useModel, history } from 'umi';
import { BookOutlined, HomeOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const { Title, Text } = Typography;

const SavedQuestionsPage: React.FC = () => {
  const { 
    savedQuestions, 
    loading, 
    fetchSavedQuestions, 
    handleSaveQuestion 
  } = useModel('savedQuestion');
  
  const { user } = useModel('user');
  
  useEffect(() => {
    if (user) {
      fetchSavedQuestions();
    }
  }, [user, fetchSavedQuestions]);
  
  const handleUnsaveQuestion = async (questionId: number) => {
    if (user) {
      await handleSaveQuestion(questionId, user);
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Card className="w-full max-w-lg text-center">
          <Title level={4}>Vui lòng đăng nhập để xem danh sách câu hỏi đã lưu</Title>
          <Button type="primary" onClick={() => history.push('/auth/login')}>
            Đăng nhập
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="mx-auto px-4 py-6 container">
      <Title level={4}>Câu hỏi đã lưu</Title>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="text-center">
              <div className="mb-4 loading-spinner"></div>
              <Text type="secondary">Đang tải danh sách câu hỏi đã lưu...</Text>
            </div>
          </div>
        ) : savedQuestions.length > 0 ? (
          <List
            dataSource={savedQuestions}
            renderItem={(item) => (
              <List.Item
                key={item.saved_id}
                actions={[
                  <Button
                    key="unsave"
                    danger
                    onClick={() => handleUnsaveQuestion(item.question.id)}
                  >
                    Bỏ lưu
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link
                      to={`/question/${item.question.id}`}
                      className="font-medium text-lg"
                    >
                      {item.question.title}
                    </Link>
                  }
                  description={
                    <Space direction="vertical" size="small" className="w-full">
                      <div>
                        <Space size={[0, 8]} wrap>
                          {item.question.tags?.map((tag: any) => (
                            <Tag color="blue" key={tag.id}>
                              <Link to={`/questions/tagged/${tag.name}`}>
                                {tag.name}
                              </Link>
                            </Tag>
                          ))}
                        </Space>
                      </div>
                      <div className="flex justify-between">
                        <Space>
                          <Tag color="blue">
                            {item.question.upvotes - item.question.downvotes}{" "}
                            votes
                          </Tag>
                          <Tag color="green">
                            {item.question.answer_count || 0} câu trả lời
                          </Tag>
                          <Tag color="orange">
                            {item.question.views} lượt xem
                          </Tag>
                        </Space>
                        <Space>
                          <Text type="secondary">
                            Đã lưu{" "}
                            {formatDistanceToNow(new Date(item.saved_at), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </Text>
                        </Space>
                      </div>
                    </Space>
                  }
                />
              </List.Item>
            )}
            pagination={{
              pageSize: 10,
              hideOnSinglePage: false,
            }}
          />
        ) : (
          <Empty
            description="Bạn chưa lưu câu hỏi nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default SavedQuestionsPage;
