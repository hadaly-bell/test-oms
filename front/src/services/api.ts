import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { ApiResponse, Partner, Order, StatusHistory, User } from '../types';

export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  return Object.keys(obj).reduce((result, key) => {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    let value = obj[key];
    
    if (Array.isArray(value)) {
      value = value.map(item => toSnakeCase(item));
    } else if (value !== null && typeof value === 'object') {
      value = toSnakeCase(value);
    }
    
    result[snakeKey] = value;
    return result;
  }, {} as Record<string, any>);
};

export const toCamelCase = (obj: Record<string, any>): Record<string, any> => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  return Object.keys(obj).reduce((result, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
    let value = obj[key];
    
    if (Array.isArray(value)) {
      value = value.map(item => toCamelCase(item));
    } else if (value !== null && typeof value === 'object') {
      value = toCamelCase(value);
    }
    
    if (key === 'partner_type') {
      result['type'] = value;
    } else if (key === 'order_type') {
      result['type'] = value;
    } else {
      result[camelKey] = value;
    }
    
    return result;
  }, {} as Record<string, any>);
};

const fetchAPI = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    const converted = toCamelCase(data);
    console.log('Converted API response:', converted);
    return converted as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const partnerApi = {
  getAll: async (): Promise<Partner[]> => {
    try {
      console.log('Fetching partners from:', API_ENDPOINTS.partners);
      const response = await fetch(API_ENDPOINTS.partners);
      const data = await response.json();
      console.log('Raw partners data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Expected array but got:', typeof data);
        return [];
      }
      
      const convertedData = data.map((item: any) => {
        console.log('Converting partner item:', item);
        return {
          id: item.id,
          name: item.name,
          representativeLastName: item.representative_last_name,
          representativeFirstName: item.representative_first_name,
          email: item.email,
          phone: item.phone,
          address: item.address,
          type: item.partner_type,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        };
      });
      
      console.log('Converted partners data:', convertedData);
      return convertedData;
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw error;
    }
  },
  
  getById: async (id: number): Promise<Partner> => {
    return fetchAPI<Partner>(`${API_ENDPOINTS.partners}/${id}`);
  },
  
  create: async (partner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Partner> => {
    const partnerData = toSnakeCase(partner);
    
    if ('type' in partnerData) {
      partnerData.partner_type = partnerData.type;
      delete partnerData.type;
    }
    
    return fetchAPI<Partner>(API_ENDPOINTS.partners, {
      method: 'POST',
      body: JSON.stringify({ partner: partnerData }),
    });
  },
  
  update: async (id: number, partner: Partial<Partner>): Promise<Partner> => {
    const partnerData = toSnakeCase(partner);
    
    if ('type' in partnerData) {
      partnerData.partner_type = partnerData.type;
      delete partnerData.type;
    }
    
    return fetchAPI<Partner>(`${API_ENDPOINTS.partners}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ partner: partnerData }),
    });
  },
  
  delete: async (id: number): Promise<void> => {
    return fetchAPI<void>(`${API_ENDPOINTS.partners}/${id}`, {
      method: 'DELETE',
    });
  },
};

export const orderApi = {
  getAll: async (type?: 'purchase' | 'sale', status?: Order['status']): Promise<Order[]> => {
    let endpoint = API_ENDPOINTS.orders;
    const params = new URLSearchParams();
    
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return fetchAPI<Order[]>(endpoint);
  },
  
  getById: async (id: number): Promise<Order> => {
    return fetchAPI<Order>(`${API_ENDPOINTS.orders}/${id}`);
  },
  
  create: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Order> => {
    const orderData = toSnakeCase(order);
    
    if ('type' in orderData) {
      orderData.order_type = orderData.type;
      delete orderData.type;
    }
    
    return fetchAPI<Order>(API_ENDPOINTS.orders, {
      method: 'POST',
      body: JSON.stringify({ order: orderData }),
    });
  },
  
  update: async (id: number, order: Partial<Order>): Promise<Order> => {
    const orderData = toSnakeCase(order);
    
    if ('type' in orderData) {
      orderData.order_type = orderData.type;
      delete orderData.type;
    }
    
    return fetchAPI<Order>(`${API_ENDPOINTS.orders}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ order: orderData }),
    });
  },
  
  delete: async (id: number): Promise<void> => {
    return fetchAPI<void>(`${API_ENDPOINTS.orders}/${id}`, {
      method: 'DELETE',
    });
  },
};

export const statusHistoryApi = {
  create: async (statusHistory: Omit<StatusHistory, 'id' | 'createdAt'>): Promise<StatusHistory> => {
    const historyData = toSnakeCase(statusHistory);
    
    return fetchAPI<StatusHistory>(`${API_BASE_URL}/status_histories`, {
      method: 'POST',
      body: JSON.stringify({ status_history: historyData }),
    });
  },
};

export const userApi = {
  getAll: async (): Promise<User[]> => {
    return fetchAPI<User[]>(`${API_BASE_URL}/users`);
  },
  
  getById: async (id: number): Promise<User> => {
    return fetchAPI<User>(`${API_BASE_URL}/users/${id}`);
  },
  
  update: async (id: number, user: Partial<User>): Promise<User> => {
    const userData = toSnakeCase(user);
    
    return fetchAPI<User>(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ user: userData }),
    });
  },
};
