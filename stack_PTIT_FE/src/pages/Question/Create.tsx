import React, { useState, useRef, useEffect } from "react";
import { Form, Input, Button, Select, message, Card, Space, Tag } from "antd";
import { useModel, history } from "umi";
import { createQuestion } from "@/services/Questions";
import TinyEditor from "@/components/TinyEditor";

const { Option } = Select;

// Định nghĩa kiểu dữ liệu cho CustomTagProps
interface CustomTagProps {
  label: React.ReactNode;
  value: any;
  closable: boolean;
  onClose: () => void;
}

const QuestionCreatePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sử dụng model tag để lấy danh sách tags
  const { tags, loading: loadingTags, fetchTags } = useModel("tag");

  const { user } = useModel("user");
  const editorRef = useRef<any>(null);

  // Gọi fetchTags khi component mount nếu tags chưa được tải
  useEffect(() => {
    if (tags.length === 0) {
      fetchTags();
    }
  }, [fetchTags, tags.length]);

  // Thêm hàm xử lý editor init
  const handleEditorInit = (editor: any) => {
    editorRef.current = editor;
  };

  const onFinish = async (values: any) => {
    if (!user) {
      message.error("Bạn cần đăng nhập để đặt câu hỏi");
      history.push("/auth/login");
      return;
    }

    if (!editorRef.current) {
      message.error("Lỗi khi tải editor");
      return;
    }

    const content = editorRef.current.getContent();

    const plainText = editorRef.current.getContent({ format: "text" });
    if (!plainText || plainText.trim().length < 20) {
      message.error("Nội dung câu hỏi phải có ít nhất 20 ký tự");
      return;
    }

    // Giới hạn số lượng tags
    if (values.tags && values.tags.length > 5) {
      message.warning("Chỉ được chọn tối đa 5 thẻ");
      values.tags = values.tags.slice(0, 5);
    }

    setLoading(true);
    try {
      const result = await createQuestion({
        title: values.title,
        content: content,
        tags: values.tags,
      });

      if (result?.success) {
        message.success("Đã đăng câu hỏi thành công!");
        history.push(`/questions`);
      } else {
        message.error(result?.message || "Không thể tạo câu hỏi");
      }
    } catch (error) {
      console.error("Lỗi khi đăng câu hỏi:", error);
      message.error("Không thể tạo câu hỏi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Custom tag render để đảm bảo hiển thị đúng
  const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        color="blue"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <Space direction="vertical" className="mx-auto p-4 container">
      <h1 className="mb-4 font-bold text-2xl">Đặt câu hỏi mới</h1>
      <Card title="Hướng đẫn đặt câu hỏi">
        <ul className="space-y-1 text-gray-600 list-disc list-inside">
          <li>Tóm tắt vấn đề của bạn trong tiêu đề rõ ràng và ngắn gọn</li>
          <li>
            Mô tả chi tiết vấn đề, những gì bạn đã thử và kết quả mong muốn
          </li>
          <li>
            Thêm thẻ liên quan để phân loại câu hỏi và giúp những người có
            chuyên môn tìm thấy nó
          </li>
          <li>Kiểm tra lỗi chính tả và định dạng trước khi gửi</li>
        </ul>
      </Card>
      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ tags: [] }}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề câu hỏi" },
              { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự" },
            ]}
          >
            <Input placeholder="Ví dụ: Làm thế nào để tạo một chương trình Java đơn giản?" />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            required
            help="Mô tả chi tiết câu hỏi của bạn. Nêu rõ vấn đề, những gì bạn đã thử và kết quả mong muốn."
          >
            <TinyEditor onEditorInit={handleEditorInit} />
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tags"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất một tag" },
              {
                type: "array",
                max: 5,
                message: "Bạn chỉ có thể chọn tối đa 5 thẻ",
              },
            ]}
            extra="Chọn hoặc tạo tối đa 5 thẻ liên quan đến câu hỏi của bạn"
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Thêm tags liên quan (tối đa 5)"
              loading={loadingTags}
              tagRender={tagRender}
              filterOption={(input, option) => {
                if (!option?.children) return false;
                return option.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
              maxTagCount={5}
              allowClear
              showArrow
              tokenSeparators={[","]}
            >
              {tags.map((tag) => (
                <Option key={tag.id} value={tag.name}>
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đăng câu hỏi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export default QuestionCreatePage;
