import React, { useState, useEffect } from 'react';
import { useLocation, Link, history } from 'umi';
import { 
  Card, 
  Input,
  Row, 
  Col, 
  Tag, 
  Typography, 
  Pagination, 
  Empty, 
  Spin,
  Space,
  Button,
  Divider,
  Select,
  InputNumber,
  Form
} from 'antd';
import { SearchOutlined, MessageOutlined, HeartOutlined, CommentOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { searchQuestions } from '@/services/Search';
import type { Question } from "@/services/Questions/typing";
import QuestionCard from '../Questions/components/QuestionCard';


const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface SearchFilters {
  text: string;
  tags: string[];
  answers: number | null;
  votes: number | null;
  comments: number | null;
  user: number | null;
}

interface SearchCondition {
  id: string;
  type: 'text' | 'tag' | 'votes' | 'answers' | 'comments' | 'user';
  value: string | number;
  operator?: '>=' | '=' | 'contains' | '<=' | '<' | '>';
}

interface QuestionCardProps {
  question: Question;
}

const SearchPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchConditions, setSearchConditions] = useState<SearchCondition[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<SearchFilters | null>(null);

  const parseSearchQuery = (query: string): SearchFilters => {
    const filters: SearchFilters = {
      text: '',
      tags: [],
      answers: null,
      votes: null,
      comments: null,
      user: null
    };

    if (!query) return filters;

    let processedQuery = query.trim();

    // Extract tags [tag]
    const tagMatches = processedQuery.match(/\[([^\]]+)\]/g);
    if (tagMatches) {
      filters.tags = tagMatches.map(match => match.slice(1, -1));
      // Remove tags from query
      processedQuery = processedQuery.replace(/\[([^\]]+)\]/g, '').trim();
    }

    // Extract answers:n
    const answersMatch = processedQuery.match(/answers:(\d+)/);
    if (answersMatch) {
      filters.answers = parseInt(answersMatch[1]);
      // Remove answers filter from query
      processedQuery = processedQuery.replace(/answers:\d+/g, '').trim();
    }

    // Extract votes:n
    const votesMatch = processedQuery.match(/votes:(\d+)/);
    if (votesMatch) {
      filters.votes = parseInt(votesMatch[1]);
      // Remove votes filter from query
      processedQuery = processedQuery.replace(/votes:\d+/g, '').trim();
    }

    // Extract comments:n
    const commentsMatch = processedQuery.match(/comments:(\d+)/);
    if (commentsMatch) {
      filters.comments = parseInt(commentsMatch[1]);
      // Remove comments filter from query
      processedQuery = processedQuery.replace(/comments:\d+/g, '').trim();
    }

    // Extract user:id
    const userMatch = processedQuery.match(/user:(\d+)/);
    if (userMatch) {
      filters.user = parseInt(userMatch[1]);
      // Remove user filter from query
      processedQuery = processedQuery.replace(/user:\d+/g, '').trim();
    }

    // Extract exact phrases "phrase" and keep them
    const exactPhrases = processedQuery.match(/"([^"]+)"/g);
    let exactPhrasesText = '';
    if (exactPhrases) {
      exactPhrasesText = exactPhrases.map(phrase => phrase.slice(1, -1)).join(' ');
      // Remove exact phrases from remaining query
      processedQuery = processedQuery.replace(/"([^"]+)"/g, '').trim();
    }

    // Clean up multiple spaces and trim
    processedQuery = processedQuery.replace(/\s+/g, ' ').trim();

    // Combine exact phrases with remaining text for content/title search
    const textParts = [];
    if (exactPhrasesText) {
      textParts.push(exactPhrasesText);
    }
    if (processedQuery) {
      textParts.push(processedQuery);
    }

    // Set text filter for searching in title and content
    filters.text = textParts.join(' ').trim();

    return filters;
  };

  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchQuestions({
        q: query,
        page,
        pageSize,
      });
      
      if (response.success) {
        setQuestions(response.data.questions);
        setTotal(response.data.total);
        setCurrentPage(response.data.page);
        
        // Parse search query to extract filters
        const parsedFilters = parseSearchQuery(query);
        setFilters(parsedFilters);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      const parsedConditions = parseQueryToConditions(initialQuery);
      setSearchConditions(parsedConditions);
      performSearchWithConditions(parsedConditions);
    } else {
      // Add default condition if no query
      setSearchConditions([{
        id: `condition_${Date.now()}_${Math.random()}`,
        type: 'text',
        value: '',
        operator: 'contains'
      }]);
    }
  }, [initialQuery]);

  const parseQueryToConditions = (query: string): SearchCondition[] => {
    const conditions: SearchCondition[] = [];
    let processedQuery = query.trim();

    // Extract tags [tag]
    const tagMatches = processedQuery.match(/\[([^\]]+)\]/g);
    if (tagMatches) {
      tagMatches.forEach(match => {
        conditions.push({
          id: `tag_${Date.now()}_${Math.random()}`,
          type: 'tag',
          value: match.slice(1, -1),
          operator: '='
        });
      });
      processedQuery = processedQuery.replace(/\[([^\]]+)\]/g, '').trim();
    }

    // Extract votes with operators: votes>=5, votes=3, votes<10, votes<=8, votes>2
    const votesMatches = processedQuery.match(/votes(>=|<=|>|<|=)(\d+)/g);
    if (votesMatches) {
      votesMatches.forEach(match => {
        const operatorMatch = match.match(/votes(>=|<=|>|<|=)(\d+)/);
        if (operatorMatch) {
          conditions.push({
            id: `votes_${Date.now()}_${Math.random()}`,
            type: 'votes',
            value: parseInt(operatorMatch[2]),
            operator: operatorMatch[1] as any
          });
        }
      });
      processedQuery = processedQuery.replace(/votes(>=|<=|>|<|=)\d+/g, '').trim();
    }

    // Extract answers with operators: answers>=2, answers=1, etc.
    const answersMatches = processedQuery.match(/answers(>=|<=|>|<|=)(\d+)/g);
    if (answersMatches) {
      answersMatches.forEach(match => {
        const operatorMatch = match.match(/answers(>=|<=|>|<|=)(\d+)/);
        if (operatorMatch) {
          conditions.push({
            id: `answers_${Date.now()}_${Math.random()}`,
            type: 'answers',
            value: parseInt(operatorMatch[2]),
            operator: operatorMatch[1] as any
          });
        }
      });
      processedQuery = processedQuery.replace(/answers(>=|<=|>|<|=)\d+/g, '').trim();
    }

    // Extract comments with operators: comments>=1, comments=0, etc.
    const commentsMatches = processedQuery.match(/comments(>=|<=|>|<|=)(\d+)/g);
    if (commentsMatches) {
      commentsMatches.forEach(match => {
        const operatorMatch = match.match(/comments(>=|<=|>|<|=)(\d+)/);
        if (operatorMatch) {
          conditions.push({
            id: `comments_${Date.now()}_${Math.random()}`,
            type: 'comments',
            value: parseInt(operatorMatch[2]),
            operator: operatorMatch[1] as any
          });
        }
      });
      processedQuery = processedQuery.replace(/comments(>=|<=|>|<|=)\d+/g, '').trim();
    }

    // Extract user:id
    const userMatch = processedQuery.match(/user:(\d+)/);
    if (userMatch) {
      conditions.push({
        id: `user_${Date.now()}_${Math.random()}`,
        type: 'user',
        value: parseInt(userMatch[1]),
        operator: '='
      });
      processedQuery = processedQuery.replace(/user:\d+/g, '').trim();
    }

    // Handle remaining text as general search
    if (processedQuery.trim()) {
      conditions.push({
        id: `text_${Date.now()}_${Math.random()}`,
        type: 'text',
        value: processedQuery.trim(),
        operator: 'contains'
      });
    }

    return conditions;
  };

  const conditionsToQueryString = (conditions: SearchCondition[]): string => {
    const parts: string[] = [];
    
    conditions.forEach(condition => {
      switch (condition.type) {
        case 'text':
          parts.push(condition.value.toString());
          break;
        case 'tag':
          parts.push(`[${condition.value}]`);
          break;
        case 'votes':
          parts.push(`votes${condition.operator}${condition.value}`);
          break;
        case 'answers':
          parts.push(`answers${condition.operator}${condition.value}`);
          break;
        case 'comments':
          parts.push(`comments${condition.operator}${condition.value}`);
          break;
        case 'user':
          parts.push(`user:${condition.value}`);
          break;
      }
    });
    
    return parts.join(' ');
  };

  const conditionsToSearchFilters = (conditions: SearchCondition[]): SearchFilters => {
    const filters: SearchFilters = {
      text: '',
      tags: [],
      answers: null,
      votes: null,
      comments: null,
      user: null
    };

    conditions.forEach(condition => {
      switch (condition.type) {
        case 'text':
          if (condition.value) {
            filters.text = filters.text ? `${filters.text} ${condition.value}` : condition.value.toString();
          }
          break;
        case 'tag':
          if (condition.value) {
            filters.tags.push(condition.value.toString());
          }
          break;
        case 'votes':
          if (condition.operator === '>=' && typeof condition.value === 'number') {
            filters.votes = condition.value;
          }
          break;
        case 'answers':
          if (condition.operator === '>=' && typeof condition.value === 'number') {
            filters.answers = condition.value;
          }
          break;
        case 'comments':
          if (condition.operator === '>=' && typeof condition.value === 'number') {
            filters.comments = condition.value;
          }
          break;
        case 'user':
          if (condition.operator === '=' && typeof condition.value === 'number') {
            filters.user = condition.value;
          }
          break;
      }
    });

    return filters;
  };

  const performSearchWithConditions = async (conditions: SearchCondition[], page: number = 1) => {
    const queryString = conditionsToQueryString(conditions);
    if (!queryString.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchQuestions({
        q: queryString,
        page,
        pageSize,
      });
      
      if (response.success) {
        setQuestions(response.data.questions);
        setTotal(response.data.total);
        setCurrentPage(response.data.page);
        
        // Convert conditions to filters for display
        const parsedFilters = conditionsToSearchFilters(conditions);
        setFilters(parsedFilters);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const queryString = conditionsToQueryString(searchConditions);
    console.log('Search conditions:', searchConditions);
    console.log('Generated query string:', queryString);
    setCurrentPage(1);
    performSearchWithConditions(searchConditions, 1);
    // Update URL
    history.push(`/search?q=${encodeURIComponent(queryString)}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    performSearchWithConditions(searchConditions, page);
  };

  const addCondition = () => {
    const newCondition: SearchCondition = {
      id: `condition_${Date.now()}_${Math.random()}`,
      type: 'text',
      value: '',
      operator: 'contains'
    };
    setSearchConditions([...searchConditions, newCondition]);
  };

  const updateConditionType = (id: string, newType: SearchCondition['type']) => {
    const defaultOperators: Record<SearchCondition['type'], SearchCondition['operator']> = {
      text: 'contains',
      tag: '=',
      votes: '>=',
      answers: '>=',
      comments: '>=',
      user: '='
    };
    
    updateCondition(id, { 
      type: newType, 
      operator: defaultOperators[newType],
      value: newType === 'text' || newType === 'tag' ? '' : 0
    });
  };

  const removeCondition = (id: string) => {
    setSearchConditions(searchConditions.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<SearchCondition>) => {
    setSearchConditions(searchConditions.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };


  const renderSearchConditionsBuilder = () => {
    return (
      <Card className="bg-[var(--bg-primary)] mb-6">
        <Title level={4} className="mb-4">
          Xây dựng điều kiện tìm kiếm
        </Title>

        <Space direction="vertical" className="w-full" size="middle">
          {searchConditions.map((condition, index) => (
            <Card key={condition.id} size="small" className="bg-gray-50">
              <Row gutter={16} align="middle">
                <Col span={4}>
                  <Select
                    value={condition.type}
                    onChange={(value) =>
                      updateConditionType(condition.id, value)
                    }
                    className="w-full"
                  >
                    <Option value="text">Văn bản</Option>
                    <Option value="tag">Tag</Option>
                    <Option value="votes">Votes</Option>
                    <Option value="answers">Answers</Option>
                    <Option value="comments">Comments</Option>
                    <Option value="user">User</Option>
                  </Select>
                </Col>

                <Col span={3}>
                  {condition.type === "text" ? (
                    <Select
                      value={condition.operator}
                      onChange={(value) =>
                        updateCondition(condition.id, { operator: value })
                      }
                      className="w-full"
                    >
                      <Option value="contains">chứa</Option>
                    </Select>
                  ) : condition.type === "tag" ? (
                    <Select
                      value={condition.operator}
                      onChange={(value) =>
                        updateCondition(condition.id, { operator: value })
                      }
                      className="w-full"
                    >
                      <Option value="=">=</Option>
                    </Select>
                  ) : condition.type === "user" ? (
                    <Select
                      value={condition.operator}
                      onChange={(value) =>
                        updateCondition(condition.id, { operator: value })
                      }
                      className="w-full"
                    >
                      <Option value="=">=</Option>
                    </Select>
                  ) : (
                    <Select
                      value={condition.operator}
                      onChange={(value) =>
                        updateCondition(condition.id, { operator: value })
                      }
                      className="w-full"
                    >
                      <Option value="=">=</Option>
                      <Option value=">=">&ge;</Option>
                      <Option value="<=">&le;</Option>
                      <Option value="<">&lt;</Option>
                      <Option value=">">&gt;</Option>
                    </Select>
                  )}
                </Col>

                <Col span={14}>
                  {condition.type === "votes" ||
                  condition.type === "answers" ||
                  condition.type === "comments" ||
                  condition.type === "user" ? (
                    <InputNumber
                      value={condition.value as number}
                      onChange={(value) =>
                        updateCondition(condition.id, { value: value || 0 })
                      }
                      min={0}
                      className="w-full"
                      placeholder={
                        condition.type === "user"
                          ? "Nhập ID người dùng"
                          : `Nhập số ${condition.type}`
                      }
                    />
                  ) : (
                    <Input
                      value={condition.value as string}
                      onChange={(e) =>
                        updateCondition(condition.id, { value: e.target.value })
                      }
                      placeholder={
                        condition.type === "text"
                          ? "Nhập từ khóa tìm kiếm..."
                          : "Nhập tên tag..."
                      }
                    />
                  )}
                </Col>

                <Col span={3}>
                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => removeCondition(condition.id)}
                    disabled={searchConditions.length === 1}
                  >
                    Xóa
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}

          <div className="flex justify-between items-center">
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addCondition}
              className="mr-4"
            >
              Thêm điều kiện
            </Button>

            <Space>
              <Button onClick={() => setSearchConditions([])}>
                Xóa tất cả
              </Button>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                disabled={
                  searchConditions.length === 0 ||
                  searchConditions.every((c) => !c.value)
                }
              >
                Tìm kiếm
              </Button>
            </Space>
          </div>
        </Space>

        {searchConditions.length === 0 && (
          <div className="py-8 text-center">
            <Text type="secondary">
              Nhấn "Thêm điều kiện" để bắt đầu xây dựng tìm kiếm
            </Text>
          </div>
        )}
      </Card>
    );
  };

  const renderActiveFilters = () => {
    if (!searchConditions || searchConditions.length === 0) return null;
    
    const activeConditions = searchConditions.filter(c => c.value);
    if (activeConditions.length === 0) return null;
    
    const getOperatorSymbol = (operator?: string) => {
      switch (operator) {
        case '>=': return '≥';
        case '<=': return '≤';
        case '>': return '>';
        case '<': return '<';
        case '=': return '=';
        case 'contains': return 'chứa';
        default: return operator || '';
      }
    };

    const getFilterDescription = (condition: SearchCondition) => {
      const operatorSymbol = getOperatorSymbol(condition.operator);
      
      switch (condition.type) {
        case 'text':
          return `Tìm trong tiêu đề/nội dung: "${condition.value}"`;
        case 'tag':
          return `Tag: [${condition.value}]`;
        case 'votes':
          return `Votes ${operatorSymbol} ${condition.value}`;
        case 'answers':
          return `Answers ${operatorSymbol} ${condition.value}`;
        case 'comments':
          return `Comments ${operatorSymbol} ${condition.value}`;
        case 'user':
          return `User: ${condition.value}`;
        default:
          return `${condition.type} ${operatorSymbol} ${condition.value}`;
      }
    };
    
    return (
      <Card className="mb-4">
        <Text strong>Điều kiện tìm kiếm đang áp dụng: </Text>
        <Space wrap>
          {activeConditions.map((condition, index) => (
            <Tag key={index} color="blue">{getFilterDescription(condition)}</Tag>
          ))}
        </Space>
      </Card>
    );
  };


  return (
    <div className="mx-auto p-4 max-w-6xl">
      <Title level={2}>Tìm kiếm nâng cao</Title>
      
      {renderSearchConditionsBuilder()}

      {renderActiveFilters()}
      
      {loading ? (
        <div className="py-8 text-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {questions.length > 0 ? (
            <>
              <div className="mb-4">
                <Text>
                  Tìm thấy <strong>{total}</strong> câu hỏi với các điều kiện đã chọn
                </Text>
              </div>
              
              {questions.map(question => (
                <QuestionCard key={question.id} question={question} />))}
              
              {total > pageSize && (
                <div className="mt-6 text-center">
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} của ${total} câu hỏi`
                    }
                  />
                </div>
              )}
            </>
          ) : searchConditions && searchConditions.some(c => c.value) ? (
            <Empty
              description="Không tìm thấy câu hỏi nào phù hợp với điều kiện"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => {
                setSearchConditions([]);
                history.push('/questions');
              }}>
                Xem tất cả câu hỏi
              </Button>
            </Empty>
          ) : (
            <div className="py-8 text-center">
              <Text type="secondary" className="text-lg">
                Thêm điều kiện tìm kiếm để bắt đầu
              </Text>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage; 