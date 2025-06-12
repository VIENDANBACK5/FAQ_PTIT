import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, message, Spin } from 'antd';
import { useModel } from 'umi';

interface ModalTagFollowProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalTagFollow: React.FC<ModalTagFollowProps> = ({ visible, setVisible }) => {
    const { tags, loading, followedTags, updateFollowedTags, followLoading } = useModel('tag');
    const { user } = useModel('user');
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredTags, setFilteredTags] = useState(tags);

    // Khi modal mở hoặc followedTags thay đổi, cập nhật selectedTags
    useEffect(() => {
        if (visible && followedTags.length > 0) {
            setSelectedTags(followedTags.map(tag => tag.id));
        }
    }, [visible, followedTags]);

    // Khi danh sách tags thay đổi, cập nhật filteredTags
    useEffect(() => {
        if (searchValue) {
            const filtered = tags.filter(tag => 
                tag.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                (tag.description && tag.description.toLowerCase().includes(searchValue.toLowerCase()))
            );
            setFilteredTags(filtered);
        } else {
            setFilteredTags(tags);
        }
    }, [tags, searchValue]);

    const toggleTag = (id: number) => {
        setSelectedTags((prev) =>
            prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
        );
    };

    const handleSaveFollows = async () => {
        if (!user) {
            message.warning("Vui lòng đăng nhập để theo dõi tags");
            return;
        }
        
        await updateFollowedTags(selectedTags);
        setVisible(false);
    };

    return (
        <Modal
            title="Thiết lập thẻ theo dõi"
            open={visible}
            footer={null}
            onCancel={() => setVisible(false)}
            width={400}
        >
            {loading || followLoading ? (
                <div className="flex justify-center items-center py-8">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <p>
                        Hãy chọn các thẻ mà bạn quan tâm để nhận thông báo khi có câu hỏi mới
                        liên quan đến thẻ đó.
                    </p>

                    <div>
                        <p className="mb-2">Tìm kiếm và chọn thẻ:</p>
                        <Input.Search
                            placeholder="Tìm kiếm thẻ..."
                            allowClear
                            size="large"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="mb-4"
                        />
                        
                        <div className="flex flex-wrap gap-2 p-2 border rounded max-h-60 overflow-y-auto">
                            {filteredTags.map((tag) => (
                                <Button
                                    key={tag.id}
                                    type={selectedTags.includes(tag.id) ? 'primary' : 'default'}
                                    onClick={() => toggleTag(tag.id)}
                                    size='middle'
                                    style={{ 
                                        borderRadius: 10,
                                        margin: '4px'
                                    }}
                                >
                                    {tag.name}
                                </Button>
                            ))}
                            
                            {filteredTags.length === 0 && (
                                <div className="py-4 w-full text-gray-500 text-center">
                                    Không tìm thấy thẻ nào phù hợp
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button onClick={() => setVisible(false)}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSaveFollows}
                            disabled={selectedTags.length === 0}
                        >
                            Lưu thẻ theo dõi
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default ModalTagFollow;
