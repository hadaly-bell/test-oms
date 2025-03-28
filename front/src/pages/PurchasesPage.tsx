import React, { useState } from 'react';
import { OrderTable } from '../components/OrderTable';
import { OrderForm } from '../components/OrderForm';
import { OrderDetail } from '../components/OrderDetail';
import { Drawer } from '../components/Drawer';
import type { Order, Partner } from '../types';

// モックデータ
const mockOrders: Order[] = [
  {
    id: 3,
    partnerId: 3,
    type: 'purchase',
    amount: 320000,
    status: 'approved',
    orderDate: '2024-03-14T00:00:00Z',
    deliveryDate: '2024-03-22T00:00:00Z',
    notes: '承認済み',
    createdAt: '2024-03-14T00:00:00Z',
    updatedAt: '2024-03-14T00:00:00Z',
    statusHistory: [],
  },
  {
    id: 4,
    partnerId: 4,
    type: 'purchase',
    amount: 180000,
    status: 'pending',
    orderDate: '2024-03-17T00:00:00Z',
    deliveryDate: null,
    notes: '見積もり確認中',
    createdAt: '2024-03-17T00:00:00Z',
    updatedAt: '2024-03-17T00:00:00Z',
    statusHistory: [],
  },
];

// モックの取引先データ
const mockPartners: Partner[] = [
  {
    id: 3,
    name: '株式会社サプライ',
    representativeLastName: '佐藤',
    representativeFirstName: '次郎',
    email: 'sato@supply.com',
    phone: '03-2345-6789',
    address: '東京都新宿区...',
    type: 'supplier',
    createdAt: '2024-03-14T00:00:00Z',
    updatedAt: '2024-03-14T00:00:00Z',
  },
  {
    id: 4,
    name: '株式会社メーカー',
    representativeLastName: '田中',
    representativeFirstName: '三郎',
    email: 'tanaka@maker.com',
    phone: '03-9876-5432',
    address: '東京都品川区...',
    type: 'supplier',
    createdAt: '2024-03-14T00:00:00Z',
    updatedAt: '2024-03-14T00:00:00Z',
  },
];

type Mode = 'list' | 'detail' | 'form';

export function PurchasesPage() {
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
          <h2 className="text-xl font-semibold text-gray-900">発注一覧</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            新規発注
          </button>
        </div>

        <OrderTable
          orders={orders}
          partners={mockPartners}
          type="purchase"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedOrder ? '発注を編集' : '新規発注を登録'}
        >
          <OrderForm
            type="purchase"
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