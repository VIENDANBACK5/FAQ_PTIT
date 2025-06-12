import request from "umi-request";
import { Comment } from "./typing";
import { API_URL } from "@/config";

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Thêm bình luận cho câu trả lời
export async function createComment(questionId: number, answerId: number, content: string): Promise<APIResponse<Comment>> {
  return request(`/api/questions/${questionId}/answers/${answerId}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: { content },
  });
}

// Lấy tất cả bình luận (cho admin dashboard)
export async function getComments(): Promise<APIResponse<Comment[]>> {
  try {
    const token = localStorage.getItem("token");
    const response = await request.get(API_URL + `/comments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: "Không thể lấy danh sách bình luận" };
  }
}