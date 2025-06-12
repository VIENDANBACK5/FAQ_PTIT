import React, { useState, useEffect } from 'react';
import { Typography, Spin, Empty, Card } from 'antd';
import { useModel } from 'umi';
import QuestionCard from '../Questions/components/QuestionCard';
import { Question } from '@/services/Questions/typing';
import { searchQuestions } from '@/services/Questions';

const { Title } = Typography;

const TagFollow: React.FC = () => {
  const { followedTags, loading: tagsLoading } = useModel('tag');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy tất cả câu hỏi từ các thẻ đã theo dõi
  const fetchAllQuestions = async () => {
    if (followedTags.length === 0) return;
    
    try {
      setLoading(true);
      
      // Tạo một mảng các Promise để lấy câu hỏi từ từng thẻ
      const promises = followedTags.map(tag => 
        searchQuestions({ tag: tag.name, page: 1, pageSize: 10 })
      );
      
      const results = await Promise.all(promises);
      
      // Kết hợp tất cả câu hỏi từ các kết quả
      let allQuestions: Question[] = [];
      results.forEach(result => {
        if (result?.success && result.data.list) {
          allQuestions = [...allQuestions, ...result.data.list];
        }
      });
      
      // Loại bỏ câu hỏi trùng lặp dựa trên ID
      const uniqueQuestions = Array.from(
        new Map(allQuestions.map(q => [q.id, q])).values()
      );
      
      // Sắp xếp câu hỏi theo ngày tạo mới nhất
      uniqueQuestions.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      
      setQuestions(uniqueQuestions);
    } catch (error) {
      console.error(`Error fetching questions:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchAllQuestions khi component mount và khi followedTags thay đổi
  useEffect(() => {
    if (followedTags.length > 0) {
      fetchAllQuestions();
    }
  }, [followedTags]);

  if (tagsLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (followedTags.length === 0) {
    return null; 
  }

  return (
    <Card title="Câu hỏi từ các thẻ bạn theo dõi" className="mb-6">
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : questions.length > 0 ? (
        <div>
          {questions.map(question => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <Empty 
          description="Không tìm thấy câu hỏi nào từ các thẻ bạn theo dõi" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

export default TagFollow;