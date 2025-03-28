export const API_BASE_URL = 'http://localhost:3000/api/v1';

// APIエンドポイント
export const API_ENDPOINTS = {
  partners: `${API_BASE_URL}/partners`,
  orders: `${API_BASE_URL}/orders`,
} as const;
