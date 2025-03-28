import React, { useState } from 'react';
import { Calendar, DollarSign, FileText, User, Clock, Tag, AlertCircle } from 'lucide-react';
import type { Order, Partner } from '../types';
import { StatusHistory } from './StatusHistory';
import { StatusChangeDialog } from './StatusChangeDialog';

interface OrderDetailProps {
  order: Order;
  partner: Partner;
  onEdit: () => void;
  onClose: () => void;
  onStatusChange: (orderId: number, newStatus: Order['status'], comment: string) => void;
}

export function OrderDetail({ order, partner, onEdit, onClose, onStatusChange }: OrderDetailProps) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    draft: '下書き',
    pending: '承認待ち',
    approved: '承認済',
    completed: '完了',
    cancelled: 'キャンセル',
  };

  const isEditableStatus = !['completed', 'cancelled'].includes(order.status);
  const canChangeStatus = !['completed', 'cancelled'].includes(order.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (newStatus: Order['status'], comment: string) => {
    onStatusChange(order.id, newStatus, comment);
    setIsStatusDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-gray-900">
          {order.type === 'sale' ? '受注' : '発注'}詳細 #{order.id}
        </h3>
        <div className="flex gap-2">
          {canChangeStatus && (
            <button
              onClick={() => setIsStatusDialogOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              ステータス変更
            </button>
          )}
          {isEditableStatus ? (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              編集
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-md">
              <AlertCircle size={16} />
              <span>編集不可</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            閉じる
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="text-gray-500" size={18} />
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="text-gray-500" size={18} />
            <span className="text-lg font-semibold">
              ¥{order.amount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={18} />
            <div className="space-y-1">
              <div>
                <span className="text-sm text-gray-500">注文日：</span>
                <span className="font-medium">{formatDate(order.orderDate)}</span>
              </div>
              {order.deliveryDate && (
                <div>
                  <span className="text-sm text-gray-500">納期：</span>
                  <span className="font-medium">{formatDate(order.deliveryDate)}</span>
                </div>
              )}
            </div>
          </div>

          {order.notes && (
            <div className="flex gap-2">
              <FileText className="text-gray-500 flex-shrink-0" size={18} />
              <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex items-start gap-2">
            <User className="text-gray-500 flex-shrink-0" size={18} />
            <div>
              <h4 className="font-medium text-gray-900">{partner.name}</h4>
              <p className="text-sm text-gray-500">担当者：{partner.representativeLastName} {partner.representativeFirstName}</p>
              <p className="text-sm text-gray-500">TEL：{partner.phone}</p>
              <p className="text-sm text-gray-500">Email：{partner.email}</p>
              <p className="text-sm text-gray-500 mt-1">{partner.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg">
        <StatusHistory history={order.statusHistory} />
      </div>

      <div className="border-t pt-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <div>
            <p>作成日時：{formatDateTime(order.createdAt)}</p>
            <p>更新日時：{formatDateTime(order.updatedAt)}</p>
          </div>
        </div>
      </div>

      {isStatusDialogOpen && (
        <StatusChangeDialog
          order={order}
          onSubmit={handleStatusChange}
          onClose={() => setIsStatusDialogOpen(false)}
        />
      )}
    </div>
  );
}