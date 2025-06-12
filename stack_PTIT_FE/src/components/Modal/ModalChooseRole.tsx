import React, { useState } from "react";
import { Modal, Button, Radio, Space, message } from "antd";
import type { RadioChangeEvent } from "antd";
import { useModel } from "umi";
import { updateUserRole } from "@/services/Users";

interface ModalChooseRoleProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onRoleConfirm?: (role: string) => void;
}

const ModalChooseRole: React.FC<ModalChooseRoleProps> = ({visible, setVisible, onRoleConfirm}) => {
    const [role, setRole] = useState<string>('student');
    const [loading, setLoading] = useState<boolean>(false);
    const { user, setUser } = useModel('user');

    const handleRoleChange = (e: RadioChangeEvent) => {
        setRole(e.target.value);
    };

    const handleReset = () => {
      setRole("student"); // Reset về giá trị mặc định nếu cần
    };    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Lưu role cho người dùng hiện tại
            if (user) {
                // Gọi API cập nhật role
                const result = await updateUserRole(
                    user.id, 
                    role as "teacher" | "student"
                );
                
                if (result.success && result.data) {
                    // Cập nhật user trong state và localStorage
                    const updatedUser = { ...user, role };
                    setUser(updatedUser);
                    
                    // Cập nhật localStorage tường minh để đảm bảo dữ liệu được lưu đúng
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    
                    message.success(`Cập nhật vai trò thành công! Bạn đã chọn vai trò: ${role === 'student' ? 'Sinh viên' : 'Giáo viên'}`);
                    
                    // Gọi callback nếu được truyền vào
                    if (onRoleConfirm) {
                        onRoleConfirm(role);
                    }
                } else {
                    message.error(result.message || "Không thể cập nhật vai trò");
                }
            }
        } catch (error) {
            console.error("Error updating role:", error);
            message.error("Có lỗi xảy ra khi cập nhật vai trò");
        } finally {
            setLoading(false);
            setVisible(false);
            handleReset(); // Reset lại vai trò sau khi xác nhận
        }
    };

    return (
        <Modal
            title="Chọn vai trò của bạn"
            open={visible}
            onCancel={() => {handleReset(); setVisible(false);}}
            footer={[
                <Button key="cancel" onClick={() => {handleReset(); setVisible(false);}}>
                    Huỷ
                </Button>,                <Button 
                    key="submit" 
                    type="primary" 
                    onClick={handleSubmit}
                    loading={loading}
                >
                    Xác nhận
                </Button>
            ]}
            width={400}
        >
            <div className="py-4">
                <p className="mb-4">Vui lòng chọn vai trò để có trải nghiệm phù hợp:</p>
                
                <Radio.Group onChange={handleRoleChange} value={role} className="w-full">
                    <Space direction="vertical" className="w-full">
                        <Radio.Button value="student" className="flex items-center py-3 w-full h-auto">
                            <div className="flex flex-col items-start">
                                <span className="font-medium">Sinh viên</span>
                                <span className="text-gray-500 text-xs">Đặt câu hỏi, tìm câu trả lời và học hỏi từ cộng đồng</span>
                            </div>
                        </Radio.Button>
                        
                        <Radio.Button value="teacher" className="flex items-center py-3 w-full h-auto">
                            <div className="flex flex-col items-start">
                                <span className="font-medium">Giáo viên</span>
                                <span className="text-gray-500 text-xs">Trả lời câu hỏi, chia sẻ kiến thức và hỗ trợ sinh viên</span>
                            </div>
                        </Radio.Button>
                    </Space>
                </Radio.Group>
            </div>
        </Modal>
    );
}

export default ModalChooseRole;