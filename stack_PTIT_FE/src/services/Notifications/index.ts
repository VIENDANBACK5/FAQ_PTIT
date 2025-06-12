import request from 'umi-request';
import { Notification } from './typing.d';

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Lấy danh sách thông báo
export async function fetchNotifications(): Promise<APIResponse<Notification[]>> {
  return request('/api/notifications', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

// Đánh dấu đã đọc một thông báo
export async function markNotificationAsRead(notificationId: number): Promise<APIResponse<any>> {
  return request(`/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

// Đánh dấu đã đọc tất cả thông báo
export async function markAllNotificationsAsRead(): Promise<APIResponse<any>> {
  return request('/api/notifications/read-all', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}