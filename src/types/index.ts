export interface Partner {
  id: number;
  name: string;
  representativeLastName: string;
  representativeFirstName: string;
  email: string;
  phone: string;
  address: string;
  type: 'supplier' | 'customer';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  partnerId: number;
  type: 'purchase' | 'sale';
  amount: number;
  status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
  orderDate: string;
  deliveryDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistory[];
}

export interface StatusHistory {
  id: number;
  orderId: number;
  fromStatus: Order['status'];
  toStatus: Order['status'];
  comment: string;
  createdAt: string;
  createdBy: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface User {
  id: number;
  email: string;
  lastName: string;
  firstName: string;
  role: 'admin' | 'user';
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}