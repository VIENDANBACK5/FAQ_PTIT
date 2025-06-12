import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Input, Button, Space, Pagination, Spin } from 'antd';
import Tags from '@/pages/Tags/components/TagCard';
import { useModel } from 'umi';

const { Title } = Typography;

const TagsPage: React.FC = () => {
  const { tags, fetchTags, loading, filter, setFilter, currentPage, setCurrentPage, paginatedTags, handleSearch, pageSize } = useModel('tag');
  return (
    <>
      <Title level={2} className='text-black'>
        Thẻ
      </Title>
      <p className='mb-4 text-gray-600'>
        Tất cả các thẻ được sử dụng để phân loại và tìm kiếm câu hỏi. Bạn có thể tìm kiếm theo tên thẻ hoặc xem tất cả các thẻ hiện có.
      </p>      
      <Space className='mb-6'>
        <Input
          placeholder="Lọc thẻ theo tên"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: 200 }}
          onPressEnter={handleSearch}
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
        <Button type="link" color='blue' onClick={fetchTags}>
          Hiển thị tất cả tags
        </Button>
      </Space>

      {loading ? (
        <div className="py-8 text-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {paginatedTags.length > 0 ? (
              paginatedTags.map((tag) => (
                <Col key={tag.id || tag.name} xs={24} sm={12} md={8} lg={6}>
                  <Tags tag={tag} />
                </Col>
              ))
            ) : (
              <Col span={24} className='text-center'>
                <Typography.Text type="secondary">
                  Không tìm thấy tags nào
                </Typography.Text>
              </Col>
            )}
          </Row>
          
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={tags.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: 24, textAlign: 'center', color: '#000' }}
            showSizeChanger={false}
          />
        </>
      )}
    </>
  );
};
export default TagsPage;