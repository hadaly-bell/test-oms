import React, { useState } from 'react';
import type { Order } from '../types';

interface StatusChangeDialogProps {
  order: Order;
  onSubmit: (newStatus: Order['status'], comment: string) => void;
  onClose: () => void;
}

export function StatusChangeDialog({ order, onSubmit, onClose }: StatusChangeDialogProps) {
  const [comment, setComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>(order.status);

  const statusFlow = {
    draft: ['pending', 'cancelled'],
    pending: ['approved', 'cancelled'],
    approved: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };

  const statusLabels = {
    draft: '下書き',
    pending: '承認待ち',
    approved: '承認済',
    completed: '完了',
    cancelled: 'キャンセル',
  };

  const availableStatuses = statusFlow[order.status];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus !== order.status) {
      onSubmit(selectedStatus, comment);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ステータスを変更
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              現在のステータス
            </label>
            <div className="text-gray-900 font-medium">
              {statusLabels[order.status]}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              新しいステータス
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Order['status'])}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={order.status}>{statusLabels[order.status]}</option>
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              コメント
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="ステータス変更の理由を入力してください"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={selectedStatus === order.status}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              変更を保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}