import { useState, useEffect } from "react";
import { message } from "antd";
import { addTag, updateTag, deleteTag, getTags } from '@/services/Tags';

export default () => {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);

  // Gọi API để lấy danh sách tag
  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await getTags();
      if (res?.success && Array.isArray(res.data)) {
        setTags(res.data);
      } else {
        throw res;
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Lỗi khi tải danh sách tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAdd = (form: any) => {
    setIsEdit(false);
    setEditingTag(null);
    setIsModalVisible(true);
  };

  const handleEdit = (tag: any, form: any) => {
    setIsEdit(true);
    setEditingTag(tag);
    form.setFieldsValue({
      name: tag.name,
      description: tag.description || ""
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTag(id);
      message.success("Đã xóa tag!");
      fetchTags();
    } catch (err: any) {
      message.error(err?.data?.message || "Xóa tag thất bại!");
    }
  };

  const handleOk = async (form: any) => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: String(values.name ?? '').trim(),
        description: String(values.description ?? '').trim()
      };

      if (isEdit && editingTag) {
        const res = await updateTag(editingTag.id, payload);
        if (res?.success && res.data) {
          message.success("Đã cập nhật tag!");
        } else {
          throw res;
        }
      } else {
        const res = await addTag(payload);
        if (res?.success && res.data) {
          message.success("Đã thêm tag mới!");
        } else {
          throw res;
        }
      }

      setIsModalVisible(false);
      setTimeout(() => form.resetFields(), 300);
      fetchTags();
    } catch (err: any) {
      message.error(err?.data?.message || err?.message || "Thao tác thất bại!");
    }
  };

  return {
    tags,
    isModalVisible,
    setIsModalVisible,
    isEdit,
    setIsEdit,
    editingTag,
    setEditingTag,
    handleAdd,
    handleEdit,
    handleDelete,
    handleOk,
    fetchTags,
    loading
  };
};
