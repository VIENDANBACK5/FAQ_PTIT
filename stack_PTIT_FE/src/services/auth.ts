import request from "umi-request";
import { User } from "./Users/typing";
import { API_URL } from "../config";

interface AuthResponse {
  success?: boolean;
  data?: {
    access_token: string;
    refresh_token: string;

  };
  message?: string;
  access_token?: string;
  token_type?: string;
}

export function login(data: { email: string; password: string }): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append("username", data.email);
  formData.append("password", data.password);
  return request(API_URL + "/auth/login", {  
    method: "POST",
    data: formData,
    requestType: "form",
    errorHandler: (error) => {
      // Nếu backend trả về lỗi tài khoản bị khoá, trả về message phù hợp
      if (error?.data?.message === 'Tài khoản đã bị khoá') {
        return Promise.reject({ ...error, message: 'Tài khoản của bạn đã bị khoá. Vui lòng liên hệ quản trị viên.' });
      }
      console.error('Login API error:', error);
      return Promise.reject(error);
    }
  });
}

export function register(data: {
  email: string;
  password: string;
  username: string;
}): Promise<AuthResponse> {
  return request(API_URL + "/auth/register", {
    method: "POST",
    data,
    errorHandler: (error) => {
      console.error('Register API error:', error);
      return Promise.reject(error);
    }
  });
}
