import React, { useState, useEffect } from 'react';
import { OrderTable } from '../components/OrderTable';
import { OrderForm } from '../components/OrderForm';
import { OrderDetail } from '../components/OrderDetail';
import { Drawer } from '../components/Drawer';
import type { Order, Partner } from '../types';
import { orderApi, partnerApi, statusHistoryApi } from '../services/api';
import { useToast } from '../hooks/useToast';

type Mode = 'list' | 'detail' | 'form';

export function PurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mode, setMode] = useState<Mode>('list');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, partnersData] = await Promise.all([
        orderApi.getAll('purchase'),
        partnerApi.getAll()
      ]);
      setOrders(ordersData);
      setPartners(partnersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      addToast('error', 'データの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleDelete = async (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        await orderApi.delete(id);
        setOrders(orders.filter(order => order.id !== id));
        addToast('success', '発注を削除しました。');
      } catch (error) {
        console.error('Failed to delete order:', error);
        addToast('error', '発注の削除に失敗しました。');
      }
    }
  };

  const handleSubmit = async (data: Partial<Order>) => {
    try {
      if (selectedOrder) {
        const updatedOrder = await orderApi.update(selectedOrder.id, data);
        setOrders(orders.map(order =>
          order.id === selectedOrder.id ? updatedOrder : order
        ));
        addToast('success', '発注を更新しました。');
      } else {
        const newOrder = await orderApi.create({
          ...data as Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>,
          type: 'purchase'
        });
        setOrders([...orders, newOrder]);
        addToast('success', '新規発注を登録しました。');
      }
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Failed to save order:', error);
      addToast('error', '発注の保存に失敗しました。');
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status'], comment: string) => {
    try {
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (!orderToUpdate) return;

      const updatedOrder = await orderApi.update(orderId, { status: newStatus });
      
      await statusHistoryApi.create({
        orderId,
        fromStatus: orderToUpdate.status,
        toStatus: newStatus,
        comment,
        createdBy: 'システム', // 後で認証ユーザー名に変更
      });

      setOrders(orders.map(order => {
        if (order.id === orderId) {
          return updatedOrder;
        }
        return order;
      }));

      addToast('success', 'ステータスを更新しました。');
    } catch (error) {
      console.error('Failed to update status:', error);
      addToast('error', 'ステータスの更新に失敗しました。');
    }
  };

  const getPartnerById = (id: number) => {
    return partners.find(partner => partner.id === id);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (mode === 'detail' && selectedOrder) {
      const partner = getPartnerById(selectedOrder.partnerId);
      if (!partner) return null;
      
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <OrderDetail
            order={selectedOrder}
            partner={partner}
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
          partners={partners}
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
            partners={partners}
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
