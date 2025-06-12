import { useState, useEffect } from "react";
import { Tag } from '@/services/Tags/typing';
import { getTags, searchTags, getUserTagFollows, followTag, unfollowTag } from '@/services/Tags';
import { message } from "antd";
import { useModel } from "umi";

export default () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [followedTags, setFollowedTags] = useState<Tag[]>([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [followLoading, setFollowLoading] = useState<boolean>(false);
    const { user } = useModel('user');
    
    const pageSize = 12; // Số lượng thẻ mỗi trang
    
    const paginatedTags = tags.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
  
    // Reset về trang đầu tiên khi thay đổi filter
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const result = await getTags();
            if (Array.isArray(result)) {
                setTags(result);
            } else if (result && result.success && Array.isArray(result.data)) {
                setTags(result.data);
            } else {
                message.error("Không thể lấy danh sách tags");
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
            message.error("Đã xảy ra lỗi khi lấy danh sách tags");
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách tags theo dõi từ API khi user đã đăng nhập
    const fetchFollowedTags = async () => {
        if (!user) return;
        
        try {
            setFollowLoading(true);
            const result = await getUserTagFollows();
            if (result && Array.isArray(result)) {
                setFollowedTags(result);
            } else if (result && result.success && Array.isArray(result.data)) {
                setFollowedTags(result.data);
            }
        } catch (error) {
            console.error("Error fetching followed tags:", error);
        } finally {
            setFollowLoading(false);
        }
    };

    // Theo dõi một tag
    const handleFollowTag = async (tagId: number) => {
        if (!user) {
            message.warning("Vui lòng đăng nhập để theo dõi tags");
            return;
        }
        try {
            setFollowLoading(true);
            await followTag(tagId);
            message.success("Đã theo dõi thẻ");
            fetchFollowedTags();
        } catch (error) {
            message.error("Lỗi khi theo dõi thẻ");
        } finally {
            setFollowLoading(false);
        }
    };

    // Bỏ theo dõi một tag
    const handleUnfollowTag = async (tagId: number) => {
        if (!user) {
            message.warning("Vui lòng đăng nhập để bỏ theo dõi tags");
            return;
        }
        try {
            setFollowLoading(true);
            await unfollowTag(tagId);
            message.success("Đã bỏ theo dõi thẻ");
            fetchFollowedTags();
        } catch (error) {
            message.error("Lỗi khi bỏ theo dõi thẻ");
        } finally {
            setFollowLoading(false);
        }
    };

    // Lấy danh sách tags từ API
    useEffect(() => {
        fetchTags();
    }, []);

    // Lấy danh sách tags theo dõi khi user thay đổi
    useEffect(() => {
        if (user) {
            fetchFollowedTags();
        } else {
            setFollowedTags([]);
        }
    }, [user]);

    // Tìm kiếm tags
    const handleSearch = async () => {
        if (!filter) {
            fetchTags();
            return;
        }
        try {
            setLoading(true);
            const result = await searchTags(filter);
            if (Array.isArray(result)) {
                setTags(result);
                setCurrentPage(1);
            } else {
                message.error("Không thể tìm kiếm tags");
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi khi tìm kiếm tags");
        } finally {
            setLoading(false);
        }
    };

    return {
        tags,
        followedTags,
        filter,
        setFilter,
        loading,
        followLoading,
        currentPage,
        setCurrentPage,
        paginatedTags,
        fetchTags,
        handleSearch,
        fetchFollowedTags,
        handleFollowTag,
        handleUnfollowTag,
        pageSize
    };
};