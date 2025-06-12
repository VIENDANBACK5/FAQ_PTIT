import React from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useModel } from "umi";

const { Title } = Typography;

const Tags: React.FC = () => {
  const [form] = Form.useForm();

  // Dùng custom hook mới
  const {
    tags,
    loading,
    isModalVisible,
    setIsModalVisible,
    isEdit,
    editingTag,
    handleAdd,
    handleEdit,
    handleDelete,
    handleOk,
  } = useModel("Admin.Tags");

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "Tên tag",
      dataIndex: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (text: string) =>
        text || <span className="text-gray-400">(Không có)</span>,
    },
    {
      title: "Số câu hỏi",
      dataIndex: "count",
      width: 120,
      render: (count: number) => count || 0,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 140,
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record, form)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa tag này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="m-0 p-3 w-full min-h-screen overflow-x-auto">
      <div className="flex justify-between items-center mx-auto mb-6 max-w-[1400px]">
        <Title level={3} style={{ margin: 0 }}>
          Quản lý tag
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAdd(form)}
        >
          Thêm tag
        </Button>
      </div>

      <div className="mx-auto max-w-[1400px]">
        <Table
          dataSource={tags}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          bordered
          scroll={{ x: true }}
        />
      </div>

      <Modal
        open={isModalVisible}
        title={isEdit ? "Sửa tag" : "Thêm tag mới"}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => handleOk(form)}
        okText={isEdit ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="name"
            label="Tên tag"
            rules={[{ required: true, message: "Nhập tên tag!" }]}
          >
            <Input placeholder="Tên tag" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea
              placeholder="Mô tả tag (không bắt buộc)"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tags;
