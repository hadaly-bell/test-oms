// APIのベースURL（後でDRFのURLに変更）
export const API_BASE_URL = 'http://localhost:8000/api';

// APIエンドポイント
export const API_ENDPOINTS = {
  partners: `${API_BASE_URL}/partners`,
  orders: `${API_BASE_URL}/orders`,
} as const;