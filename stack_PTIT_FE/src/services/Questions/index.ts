import request from "umi-request";
import { Question } from "./typing";
import { Answer } from "../Answers/typing";
import { Comment } from "../Comments/typing";
import { API_URL } from "@/config";

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  message?: string;
}

interface SearchResponse<T> {
  success: boolean;
  data: {
    list: T[];
    total: number;
  };
  message?: string;
}

interface PaginatedResponseWithData<T> {
  success: boolean;
  data: {
    questions: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  message?: string;
}

// Lấy danh sách câu hỏi
export async function getQuestions(params?: {
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: string;
}): Promise<PaginatedResponse<Question>> {
  return request(API_URL + "/questions", {
    method: "GET",
    params,
  });
}



// Lấy chi tiết câu hỏi
export async function getQuestionDetail(question_id: number): Promise<APIResponse<Question>> {
  return request(API_URL + `/questions/${question_id}`, {
    method: "GET",
  });
}

// Tạo câu hỏi mới
export async function createQuestion(data: {
  title: string;
  content: string;
  tags: string[];
}): Promise<APIResponse<Question>> {
  return request(API_URL + "/questions", {
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

// Bình chọn câu hỏi
export async function voteQuestion(id: number, direction: "up" | "down"): Promise<APIResponse<Question>> {
  return request(API_URL + `/vote`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: { direction },
  });
}

// Thêm câu trả lời cho câu hỏi
export async function createAnswer(question_id: number, content: string): Promise<APIResponse<Answer>> {
  return request(API_URL + `/answers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: { question_id, content },
  });
}

// Bình chọn câu trả lời
export async function voteAnswer(questionId: number, answerId: number, direction: "up" | "down"): Promise<APIResponse<Answer>> {
    return request(API_URL + `/questions/${questionId}/answers/${answerId}/vote`, {
      method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: { direction },
  });
}

// Đánh dấu câu trả lời là đúng (chấp nhận)
export async function acceptAnswer(id: number): Promise<APIResponse<Answer>> {
  return request(API_URL + `/accept/{id}/accept`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

// Thêm bình luận cho câu trả lời hoặc câu hỏi
export async function createComment(id: number, question_id: number, answer_id: number, content: string): Promise<APIResponse<Comment>> {
  // Nếu có answer_id thì gửi bình luận cho answer, ngược lại cho question
  const data: any = { content };
  if (answer_id) {
    data.answer_id = answer_id;
  } else if (question_id) {
    data.question_id = question_id;
  }
  return request(API_URL + `/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data,
  });
}

// Tìm kiếm câu hỏi (theo keyword hoặc tag)
export async function searchQuestions(params: {
  keyword?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
}): Promise<SearchResponse<Question>> {
  let url = API_URL + '/questions/search/${params.keyword}';
  const query: any = {};
  if (params.keyword) query.keyword = params.keyword;
  if (params.tag) query.tag = params.tag;
  if (params.page) query.page = params.page;
  if (params.pageSize) query.pageSize = params.pageSize;
  const response = await request(url, {
    method: "GET",
    params: query,
  });
  // Chuẩn hóa dữ liệu trả về
  if (response?.data?.list) {
    return { ...response, data: { list: response.data.list, total: response.data.total } };
  } else if (response?.data?.questions) {
    return { ...response, data: { list: response.data.questions, total: response.data.total } };
  } else {
    return { success: false, data: { list: [], total: 0 }, message: response?.message || "Không có dữ liệu" };
  }
}

// Lấy câu hỏi theo tag
export async function getQuestionsByTag(tagId: number) {
  return request(API_URL + `/questions/by_tag/${tagId}`, {
    method: "GET",
  });
}

// Xoá câu hỏi
export async function deleteQuestion(question_id: number): Promise<{ success: boolean; message?: string }> {
  return request(API_URL + `/questions/${question_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}