import request from "umi-request";
import { Tag } from "./typing";
import { API_URL } from "@/config";

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Lấy danh sách tất cả các tags (có count)
export async function getTags(): Promise<APIResponse<Tag[]>> {
  return request(API_URL + `/tags/with_count`, {
    method: "GET",
  });
}

// Lấy tag theo ID
export async function getTagById(id: number): Promise<APIResponse<Tag>> {
  return request(API_URL + `/tags/${id}`, {
    method: "GET",
  });
}

// Tìm kiếm tags
export async function searchTags(keyword: string): Promise<Tag[]> {
  return request(API_URL + `/tags/search`, {
    method: "GET",
    params: { keyword },
  });
}

// Lấy danh sách tags theo dõi của user hiện tại
export async function getUserTagFollows(): Promise<APIResponse<Tag[]>> {
  return request(API_URL + `/tags/followed`, {
    method: "GET",
  });
}

// Theo dõi một tag
export async function followTag(tagId: number): Promise<any> {
  return request(API_URL + `/tags/follow/${tagId}`, {
    method: "POST",
  });
}

// Bỏ theo dõi một tag
export async function unfollowTag(tagId: number): Promise<any> {
  return request(API_URL + `/tags/follow/${tagId}`, {
    method: "DELETE",
  });
}

// Thêm tag mới
export async function addTag(data: { name: string; description?: string }): Promise<{ success: boolean; data?: Tag; message?: string }> {
  return request(API_URL + "/tags", {
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

// Cập nhật tag
export async function updateTag(id: number, data: { name?: string; description?: string }): Promise<{ success: boolean; data?: Tag; message?: string }> {
  return request(API_URL + `/tags`, {
    method: "PUT",
    data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

// Xóa tag
export async function deleteTag(id: number): Promise<{ success: boolean; message?: string }> {
  return request(API_URL + `/tags/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}
