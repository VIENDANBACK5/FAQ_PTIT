import React from "react";
import { Button, Select, Pagination, Spin, Empty, Typography } from "antd";
import Question from "./components/QuestionCard";
import { Link } from "umi";
import { useModel } from "umi";

const { Title } = Typography;

const QuestionPage: React.FC = () => {
  const {
    questions,
    total,
    page,
    pageSize,
    handleFilterChange,
    handlePageChange,
    handleSortChange,
    sort,
    filter,
    loading,
  } = useModel("Question.question");

  return (
    <div>
      <div className="flex justify-between">
        <Title level={2}>Danh sách câu hỏi</Title>
        <Link to="/ask">
          <Button type="primary">+ Đặt câu hỏi</Button>
        </Link>
      </div>
      <div className="flex gap-2 mb-4">
        <div>
          <p>Sắp xếp theo</p>
          <Select
            value={sort}
            onChange={handleSortChange}
            style={{ width: 200 }}
            options={[
              { value: "newest", label: "Mới nhất" },
              { value: "popular", label: "Phổ biến" },
            ]}
          />
        </div>
        <div>
          <p>Hiển thị</p>
          <Select
            value={filter}
            onChange={handleFilterChange}
            style={{ width: 200 }}
            options={[
              { value: "all", label: "Tất cả câu hỏi" },
              { value: "no answer", label: "Chưa có câu trả lời" },
              { value: "answered", label: "Đã có câu trả lời" },
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
          {questions.map((question) => (
            <Question key={question.id} question={question} />
          ))}

          <div className="flex justify-center mt-4">
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
          description="Không tìm thấy câu hỏi nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
};

export default QuestionPage;
