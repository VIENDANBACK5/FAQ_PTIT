export interface Tag {
  id: number;
  name: string;
  description?: string;
  count?: number; // Số lượng câu hỏi có tag này
}