import React from 'react';
import { History, ArrowRight } from 'lucide-react';
import type { StatusHistory } from '../types';

interface StatusHistoryProps {
  history: StatusHistory[];
}

export function StatusHistory({ history }: StatusHistoryProps) {
  const statusLabels = {
    draft: '下書き',
    pending: '承認待ち',
    approved: '承認済',
    completed: '完了',
    cancelled: 'キャンセル',
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

  return (
    <div className="space-y-4">
      <h4 className="flex items-center gap-2 font-medium text-gray-900">
        <History size={18} />
        <span>ステータス履歴</span>
      </h4>
      
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="font-medium">{formatDateTime(item.createdAt)}</span>
              <span className="text-gray-400">by {item.createdBy}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                {statusLabels[item.fromStatus]}
              </span>
              <ArrowRight size={16} className="text-gray-400" />
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                {statusLabels[item.toStatus]}
              </span>
            </div>
            
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}