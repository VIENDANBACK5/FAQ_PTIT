import { useState, useEffect } from "react";
import { users as mockUsers } from "@/mock/users";
import { lockUser, unlockUser } from "@/services/Users";
import { getUsers } from "@/services/Users";

export default () => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // Hàm đồng bộ lại danh sách users từ mock backend (biến users trong mock/users)
  const syncUsers = () => {
    setUsers(
      mockUsers.filter((u: any) => u.role !== 'admin').map((u: any) => ({ ...u, is_activate: typeof u.is_activate === 'boolean' ? u.is_activate : true }))
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        if (res?.success && Array.isArray(res.data)) {
          setUsers(res.data);
        }
      } catch (err) {
        // handle error nếu cần
      }
    };
    fetchUsers();
  }, []);

  const openModal = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  // Huỷ logic xoá user
  // const handleDeleteUser = async (id: number) => { ... }

  const handleToggleStatus = async (id: number) => {
    const user = users.find((u: any) => u.id === id);
    if (!user) return;
    let apiResult;
    if (user.is_activate) {
      apiResult = await lockUser(id);
    } else {
      apiResult = await unlockUser(id);
    }
    const is_activate = apiResult && apiResult.success && apiResult.data ? apiResult.data.is_activate : !user.is_activate;
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, is_activate } : u
    ));
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser((prev: any) => prev ? { ...prev, is_activate } : prev);
    }
  };

  return {
    users,
    selectedUser,
    modalVisible,
    openModal,
    closeModal,
    // handleDeleteUser, // Không export nữa
    handleToggleStatus,
    setSelectedUser,
    setUsers,
  };
};
