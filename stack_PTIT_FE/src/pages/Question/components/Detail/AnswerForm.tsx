import React, { useRef } from "react";
import { Card, Button, Typography } from "antd";
import { history } from "umi";
import TinyEditor from "@/components/TinyEditor";

const { Text } = Typography;

interface AnswerFormProps {
  isAuthenticated: boolean;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
  onEditorInit: (editor: any) => void;
  questionUserId: number | string;
  currentUserId: string | number | undefined;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  isAuthenticated,
  isSubmitting,
  handleSubmit,
  onEditorInit,
  questionUserId,
  currentUserId,
}) => {
  const isQuestionOwner = currentUserId && questionUserId === currentUserId;

  if (isQuestionOwner) {
    return (
      <div className="mt-6">
        <Card title="Trả lời">
          <div className="py-4 text-center">
            <Text type="secondary">
              Bạn không thể tự trả lời câu hỏi của chính mình.
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mt-6">
        <Card title="Trả lời">
          <div className="py-4 text-center">
            <Text type="secondary">
              Vui lòng{" "}
              <a onClick={() => history.push("/auth/login")}>đăng nhập</a> để
              trả lời câu hỏi này
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Card title="Câu trả lời của bạn">
        <div>
          <TinyEditor onEditorInit={onEditorInit} />
          <div className="mt-4">
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              Đăng câu trả lời
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnswerForm;
