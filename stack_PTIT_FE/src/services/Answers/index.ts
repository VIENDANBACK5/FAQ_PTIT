import request from "umi-request";
import { Answer } from "./typing";

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Thêm câu trả lời cho câu hỏi
export async function createAnswer(questionId: number, content: string): Promise<APIResponse<Answer>> {
  return request(`/api/questions/${questionId}/answers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: { content },
  });
}

// Bình chọn câu trả lời
export async function voteAnswer(questionId: number, answerId: number, direction: "up" | "down"): Promise<APIResponse<Answer>> {
  return request(`/api/questions/${questionId}/answers/${answerId}/vote`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: { direction },
  });
}

// Đánh dấu câu trả lời là đúng (chấp nhận)
export async function acceptAnswer(questionId: number, answerId: number): Promise<APIResponse<Answer>> {
  return request(`/api/questions/${questionId}/answers/${answerId}/accept`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}