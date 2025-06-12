// src/pages/Profile/components/Setting/PreferencesSetting.tsx
import {
  Form,
  Switch,
  Select,
  Button,
  Card,
  message,
  Radio,
  Slider,
} from "antd";
import {
  ArrowLeftOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Link, useParams, useModel } from "umi";
import { useState, useEffect } from "react";

const { Option } = Select;

const PreferencesSetting: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useModel("user");
  const { theme, setTheme } = useModel("theme");
  
  // Cập nhật form khi user thay đổi
  useEffect(() => {
    form.setFieldsValue({
      theme: user?.theme || theme || "light",
    });
  }, [user, theme, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Cập nhật theme
      if (values.theme !== theme) {
        await setTheme(values.theme);
      }
      message.success("Cập nhật cài đặt giao diện thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật cài đặt:", error);
      message.error("Có lỗi xảy ra khi cập nhật cài đặt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="ml-4 font-bold text-2xl">Cài đặt giao diện</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <Card title="Giao diện">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              theme: "light",
              language: "vi",
              fontSize: 14,
              showNotifications: true,
              autoSave: true,
              showOnlineStatus: true,
            }}
          >            <Form.Item label="Chủ đề" name="theme">
              <Radio.Group>
                <Radio.Button value="light">
                  <SunOutlined /> Sáng
                </Radio.Button>
                <Radio.Button value="dark">
                  <MoonOutlined /> Tối
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                Lưu cài đặt
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Notification Settings */}
        <Card title="Thông báo">
          <Form.Item
            label="Nhận thông báo"
            name="showNotifications"
            valuePropName="checked"
          >
            <Switch disabled />
          </Form.Item>

          <Form.Item
            label="Thông báo email"
            name="emailNotifications"
            valuePropName="checked" 
          >
            <Switch onChange={() => message.info('chưa phát triển')} />
          </Form.Item> 

          <Form.Item
            label="Thông báo khi có câu trả lời mới"
            name="answerNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            Lưu cài đặt
          </Button>
        </Form.Item>
      </div>
    </div>
  );
};

export default PreferencesSetting;
