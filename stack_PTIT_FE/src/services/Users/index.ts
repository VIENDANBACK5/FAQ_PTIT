import request from "umi-request";
import { User } from "./typing";
import { Question } from "../Questions/typing";
import { Answer } from "../Answers/typing";
import { Tag } from "../Tags/typing";
import { API_URL } from "@/config";

interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const getUserMe = async (): Promise<APIResponse<User>> => {
  try {
    const token = localStorage.getItem("token");
    const response = await request.get(API_URL + `/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: "Không thể lấy thông tin người dùng" };
  }
};

// Thêm hàm updateUser để cập nhật thông tin người dùng
export const updateUser = async (id: string, userData: Partial<User>): Promise<APIResponse<User>> => {
  // Lấy token từ localStorage
  const token = localStorage.getItem("token");
  
  try {
    const response = await request.put(API_URL + `/users/me`, {  
      data: userData,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message: "Không thể cập nhật thông tin người dùng"
    };
  }
};

export const getUserById = async (id: string): Promise<APIResponse<User>> => {
  try {
    const response = await request.get(API_URL + `/users/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      message: "Không thể lấy thông tin người dùng"
    };
  }
};

export const getUserQuestions = async (userId: number): Promise<APIResponse<Question[]>> => {
  try {
      const response = await request.get(API_URL + `/users/me/questions`);
      return {
        success: true,
        data: Array.isArray(response) ? response : response.data
      };
  } catch (error) {
    console.error("Error fetching user questions:", error);
    return {
      success: false,
      message: "Không thể lấy danh sách câu hỏi của người dùng"
    };
  }
};

export const getUserAnswers = async (userId: number): Promise<APIResponse<Answer[]>> => {
  try {
    const response = await request.get(API_URL + `/users/me/answers`);
    return {
      success: true,
      data: Array.isArray(response) ? response : response.data
    };
  } catch (error) {
    console.error("Error fetching user answers:", error);
    return {
      success: false,
      message: "Không thể lấy danh sách câu trả lời của người dùng"
    };
  }
};

export const getUserTags = async (userId: number): Promise<APIResponse<Tag[]>> => {
  try {
    const response = await request.get(API_URL + `/tags/followed`);
    return {
      success: true,
      data: Array.isArray(response) ? response : response.data
    };
  } catch (error) {
    console.error("Error fetching user tags:", error);
    return {
      success: false,
      message: "Không thể lấy danh sách thẻ của người dùng"
    };
  }
};

export const lockUser = async (id: number): Promise<APIResponse<User>> => {
  try {
    const response = await request.post(API_URL + `/users/${id}/lock`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error locking user:", error);
    return {
      success: false,
      message: "Không thể khoá tài khoản người dùng"
    };
  }
};

export const unlockUser = async (id: number): Promise<APIResponse<User>> => {
  try {
    const response = await request.post(API_URL + `/users/${id}/unlock`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error unlocking user:", error);
    return {
      success: false,
      message: "Không thể mở khoá tài khoản người dùng"
    };
  }
};

export const deleteUsers = async (ids: number[]): Promise<APIResponse<null>> => {
  try {
    await request.delete(API_URL + `/users`, { data: { ids } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting users:", error);
    return { success: false, message: "Không thể xoá nhiều người dùng" };
  }
};

export const updateUserTheme = async (theme: "light" | "dark"): Promise<APIResponse<User>> => {
  try {
    const response = await request.put(API_URL + '/users/me', { theme });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error updating user theme:", error);
    return {
      success: false,
      message: "Không thể cập nhật giao diện người dùng"
    };
  }
};

export const updateUserRole = async (userId: number, role: "teacher" | "student"): Promise<APIResponse<User>> => {
  try {
    const response = await request.put(API_URL + `/users/${userId}/role`, { role });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      message: "Không thể cập nhật vai trò người dùng"
    };
  }
};

// Lấy danh sách tất cả user (cho admin)
export const getUsers = async (): Promise<APIResponse<User[]>> => {
  try {
    const token = localStorage.getItem("token");
    const response = await request.get(API_URL + `/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: "Không thể lấy danh sách người dùng" };
  }
};
