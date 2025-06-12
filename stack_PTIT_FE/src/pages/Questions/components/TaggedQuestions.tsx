import React, { useState, useEffect } from "react";
import { Button, Select, Pagination, Spin, Empty, Typography, Tag as AntdTag } from "antd";
import Question from "./QuestionCard";
import { Link, useParams, useModel } from "umi";
import { getQuestionsByTag } from "@/services/Questions";
import { Question as QuestionType } from "@/services/Questions/typing";

const { Title, Text } = Typography;

const TaggedQuestions: React.FC = () => {
  const { tagname } = useParams<{ tagname: string }>();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState("all");
  const { tags, loading: tagsLoading } = useModel('tag');
  
  const currentTag = tags.find(t => t.name === tagname);
  const tagId = currentTag?.id;

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      if (tagId) {
        const response = await getQuestionsByTag(tagId);
        console.log("API response:", response);
        if (Array.isArray(response)) {
          setQuestions(response);
          setTotal(response.length);
        } else if (response?.data) {
          setQuestions(response.data.questions || response.data || []);
          setTotal(response.data.total || response.data.length || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tagname) {
      fetchQuestions();
    }
  }, [tagname, page, pageSize, sort, filter]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize) setPageSize(newPageSize);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Title level={2} className="m-0 font-bold">
              {tagname}
            </Title>
          </div>
          <Link to="/ask">
            <Button type="primary">+ Đặt câu hỏi</Button>
          </Link>
        </div>
        <Text type="secondary" className="text-base">
          {currentTag?.description || "Không có mô tả cho thẻ này."}
        </Text>
      </div>

      <div className="flex gap-4 mb-6">
        <div>
          <p className="mb-2 text-gray-600">Sắp xếp theo</p>
          <Select
            value={sort}
            onChange={handleSortChange}
            style={{ width: 200 }}
            options={[
              { value: "newest", label: "Mới nhất" },
              { value: "popular", label: "Phổ biến" },
              { value: "votes", label: "Nhiều vote nhất" },
              { value: "unanswered", label: "Chưa trả lời" },
            ]}
          />
        </div>
        <div>
          <p className="mb-2 text-gray-600">Hiển thị</p>
          <Select
            value={filter}
            onChange={handleFilterChange}
            style={{ width: 200 }}
            options={[
              { value: "all", label: "Tất cả câu hỏi" },
              { value: "no answer", label: "Chưa có câu trả lời" },
              { value: "answered", label: "Đã có câu trả lời" },
              { value: "accepted", label: "Có câu trả lời được chấp nhận" },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : questions.length > 0 ? (
        <div>
          <div className="mb-4">
            <Text strong>{total} câu hỏi</Text>
          </div>
          {questions.map((question) => (
            <Question key={question.id} question={question} />
          ))}

          <div className="flex justify-center mt-6">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger
              showTotal={(total) => `Tổng cộng ${total} câu hỏi`}
            />
          </div>
        </div>
      ) : (
        <Empty
          description={`Không tìm thấy câu hỏi nào với thẻ "${tagname}"`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link to="/questions">
            <Button type="primary">Xem tất cả câu hỏi</Button>
          </Link>
        </Empty>
      )}
    </div>
  );
};

export default TaggedQuestions;