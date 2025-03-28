import React, { useState } from 'react';
import { OrderTable } from '../components/OrderTable';
import { OrderForm } from '../components/OrderForm';
import { OrderDetail } from '../components/OrderDetail';
import { Drawer } from '../components/Drawer';
import type { Order, Partner } from '../types';

// モックデータ
const mockOrders: Order[] = [
  {
    id: 1,
    partnerId: 1,
    type: 'sale',
    amount: 150000,
    status: 'completed',
    orderDate: '2024-03-15T00:00:00Z',
    deliveryDate: '2024-03-20T00:00:00Z',
    notes: '納品完了',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    statusHistory: [],
  },
  {
    id: 2,
    partnerId: 2,
    type: 'sale',
    amount: 280000,
    status: 'pending',
    orderDate: '2024-03-16T00:00:00Z',
    deliveryDate: '2024-03-25T00:00:00Z',
    notes: '確認待ち',
    createdAt: '2024-03-16T00:00:00Z',
    updatedAt: '2024-03-16T00:00:00Z',
    statusHistory: [],
  },
];

// モックの取引先データ
const mockPartners: Partner[] = [
  {
    id: 1,
    name: '株式会社ABC商事',
    representativeLastName: '山田',
    representativeFirstName: '太郎',
    email: 'yamada@abc.com',
    phone: '03-1234-5678',
    address: '東京都渋谷区...',
    type: 'customer',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 2,
    name: '株式会社XYZ',
    representativeLastName: '鈴木',
    representativeFirstName: '一郎',
    email: 'suzuki@xyz.com',
    phone: '03-8765-4321',
    address: '大阪府大阪市...',
    type: 'customer',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
];

type Mode = 'list' | 'detail' | 'form';

export function SalesPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mode, setMode] = useState<Mode>('list');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAdd = () => {
    setSelectedOrder(null);
    setIsDrawerOpen(true);
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setMode('detail');
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  const handleSubmit = (data: Partial<Order>) => {
    if (selectedOrder) {
      setOrders(orders.map(order =>
        order.id === selectedOrder.id
          ? { ...selectedOrder, ...data, updatedAt: new Date().toISOString() }
          : order
      ));
    } else {
      const newOrder: Order = {
        id: Math.max(...orders.map(order => order.id)) + 1,
        ...data as Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [],
      };
      setOrders([...orders, newOrder]);
    }
    setIsDrawerOpen(false);
  };

  const handleStatusChange = (orderId: number, newStatus: Order['status'], comment: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const statusHistory = [
          ...order.statusHistory,
          {
            id: Math.random(), // 実際のアプリではサーバーで生成
            orderId,
            fromStatus: order.status,
            toStatus: newStatus,
            comment,
            createdAt: new Date().toISOString(),
            createdBy: 'システム', // 後で認証ユーザー名に変更
          }
        ];
        return {
          ...order,
          status: newStatus,
          statusHistory,
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    }));
  };

  const getPartnerById = (id: number) => {
    return mockPartners.find(partner => partner.id === id)!;
  };

  const renderContent = () => {
    if (mode === 'detail' && selectedOrder) {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <OrderDetail
            order={selectedOrder}
            partner={getPartnerById(selectedOrder.partnerId)}
            onEdit={() => {
              setMode('list');
              setIsDrawerOpen(true);
            }}
            onClose={() => setMode('list')}
            onStatusChange={handleStatusChange}
          />
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">受注一覧</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            新規受注
          </button>
        </div>

        <OrderTable
          orders={orders}
          partners={mockPartners}
          type="sale"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedOrder ? '受注を編集' : '新規受注を登録'}
        >
          <OrderForm
            type="sale"
            order={selectedOrder ?? undefined}
            partners={mockPartners}
            onSubmit={handleSubmit}
            onCancel={() => setIsDrawerOpen(false)}
          />
        </Drawer>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
}