import request from 'umi-request';

export interface SearchParams {
  q?: string;  // query string general
  tag?: string;
  answers?: number;
  votes?: number;
  comments?: number;
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  success: boolean;
  data: {
    questions: any[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export async function searchQuestions(params: SearchParams): Promise<SearchResult> {
  const { q, page, pageSize } = params;
  const queryString = q ? encodeURIComponent(q) : '';
  
  return request(`/api/questions/search/${queryString}`, {
    method: 'GET',
    params: { page, pageSize },
  });
}

export async function getSearchSuggestions(keyword: string) {
  const encodedKeyword = encodeURIComponent(keyword);
  return request(`/api/questions/search/suggestions/${encodedKeyword}`, {
    method: 'GET',
  });
} 