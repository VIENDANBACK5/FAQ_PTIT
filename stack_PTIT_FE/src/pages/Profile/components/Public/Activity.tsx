import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Timeline, Tag, Card, Typography, Space, Divider, Spin } from 'antd';
import { Link } from 'umi';
import { 
  QuestionCircleOutlined, 
  CommentOutlined, 
  LikeOutlined, 
  CheckCircleOutlined,
  TagOutlined
} from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { User } from "@/services/Users/typing";
import { Question } from "@/services/Questions/typing";
import { Tag as TagType } from "@/services/Tags/typing";

const { Text, Title } = Typography;

interface ActivityProps {
  user?: User | null;
}

// Định nghĩa kiểu dữ liệu rõ ràng cho các hoạt động
interface QuestionActivity {
  id: string;
  type: 'question';
  title: string;
  link: string;
  date: string;
  tags?: TagType[];
}

interface AnswerActivity {
  id: string;
  type: 'answer';
  title: string;
  link: string;
  date: string;
  is_accepted?: boolean;
}

type Activity = QuestionActivity | AnswerActivity;

const Activity: React.FC<ActivityProps> = ({ user }) => {
  // Sử dụng model profile để lấy dữ liệu
  const { 
    questions, 
    answers, 
    loading, 
    fetchUserData 
  } = useModel('profile');

  useEffect(() => {
    if (user?.id) {
      fetchUserData(user.id);
    }
  }, [user?.id, fetchUserData]);

  // Tạo danh sách các hoạt động từ câu hỏi và câu trả lời
  const activities: Activity[] = [
    ...questions.map(q => ({
      id: `question-${q.id}`,
      type: 'question' as const,
      title: q.title,
      link: `/question/${q.id}`,
      date: q.created_at,
      tags: q.tags
    })),
    ...answers.map(a => ({
      id: `answer-${a.id}`,
      type: 'answer' as const,
      title: a.question_title || `Câu trả lời cho câu hỏi #${a.question_id}`,
      link: `/question/${a.question_id}`,
      date: a.created_at,
      is_accepted: a.is_accepted
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card title={<Title level={4}>Hoạt động gần đây</Title>}>
      <Spin spinning={loading.questions || loading.answers}>
        {activities.length > 0 ? (
          <Timeline mode="left">
            {activities.map((activity) => (
              <Timeline.Item
                key={activity.id}
                dot={
                  activity.type === 'question' 
                    ? <QuestionCircleOutlined style={{ fontSize: '18px' }} /> 
                    : <CommentOutlined style={{ fontSize: '18px' }} />
                }
                color={activity.type === 'question' ? 'blue' : 'green'}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    {activity.type === 'question' ? (
                      <>
                        <Text strong>Đã đăng câu hỏi </Text>
                        <Link to={activity.link} className="font-semibold">
                          {activity.title}
                        </Link>
                        {activity.tags && activity.tags.length > 0 && (
                          <div className="mt-1">
                            {activity.tags.map((tag: TagType) => (
                              <Tag key={tag.id} className="mr-1">
                                <Link to={`/questions/tagged/${tag.name}`}>{tag.name}</Link>
                              </Tag>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <Text strong>Đã trả lời câu hỏi </Text>
                        <Link to={activity.link} className="font-semibold">
                          {activity.title}
                        </Link>
                        {activity.is_accepted && (
                          <Tag color="green" className="ml-2">Đã chấp nhận</Tag>
                        )}
                      </>
                    )}
                  </div>
                  <Text type="secondary">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true, locale: vi })}
                  </Text>
                </Space>
                <Divider className="my-2" />
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <div className="py-8 text-center">
            <Text type="secondary">Không có hoạt động nào gần đây</Text>
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default Activity;
