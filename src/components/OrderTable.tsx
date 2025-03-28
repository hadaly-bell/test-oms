import React, { useState, useMemo } from 'react';
import { Trash2, Eye, AlertCircle, ChevronDown, ChevronUp, X, Search, Filter } from 'lucide-react';
import type { Order, Partner } from '../types';
import { StatusChangeDialog } from './StatusChangeDialog';

interface OrderTableProps {
  orders: Order[];
  partners: Partner[];
  type: 'sale' | 'purchase';
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
  onStatusChange: (orderId: number, newStatus: Order['status'], comment: string) => void;
}

type SortField = 'id' | 'partnerId' | 'amount' | 'status' | 'orderDate' | 'deliveryDate';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  partnerId: number | '';
  minAmount: number | '';
  maxAmount: number | '';
  status: Order['status'] | '';
  startDate: string;
  endDate: string;
}

export function OrderTable({ orders, partners, type, onView, onEdit, onDelete, onStatusChange }: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'id',
    direction: 'desc'
  });
  const [filters, setFilters] = useState<FilterState>({
    partnerId: '',
    minAmount: '',
    maxAmount: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const statusColors = {
    draft: 'bg-slate-100 text-slate-800',
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-sky-100 text-sky-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-rose-100 text-rose-800',
  };

  const statusLabels = {
    draft: '下書き',
    pending: '承認待ち',
    approved: '承認済',
    completed: '完了',
    cancelled: 'キャンセル',
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = orders.filter(order => order.type === type);

    // フィルタリング
    if (filters.partnerId) {
      result = result.filter(order => order.partnerId === filters.partnerId);
    }
    if (filters.minAmount !== '') {
      result = result.filter(order => order.amount >= filters.minAmount);
    }
    if (filters.maxAmount !== '') {
      result = result.filter(order => order.amount <= filters.maxAmount);
    }
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }
    if (filters.startDate) {
      result = result.filter(order => order.orderDate >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter(order => order.orderDate <= filters.endDate);
    }

    // ソート
    return result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'partnerId':
          comparison = a.partnerId - b.partnerId;
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'orderDate':
          comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
          break;
        case 'deliveryDate':
          if (!a.deliveryDate) return 1;
          if (!b.deliveryDate) return -1;
          comparison = new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
          break;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [orders, type, filters, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ChevronUp size={14} className="opacity-0 group-hover:opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="text-blue-600" />
      : <ChevronDown size={14} className="text-blue-600" />;
  };

  const isEditableStatus = (status: Order['status']) => {
    return !['completed', 'cancelled'].includes(status);
  };

  const isDeletableStatus = (status: Order['status']) => {
    return ['draft', 'pending'].includes(status);
  };

  const canChangeStatus = (status: Order['status']) => {
    return !['completed', 'cancelled'].includes(status);
  };

  const handleStatusClick = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (canChangeStatus(order.status)) {
      setSelectedOrder(order);
      setIsStatusDialogOpen(true);
    }
  };

  const handleStatusChange = (newStatus: Order['status'], comment: string) => {
    if (selectedOrder) {
      onStatusChange(selectedOrder.id, newStatus, comment);
      setIsStatusDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleView = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    onView(order);
  };

  const getPartnerName = (partnerId: number) => {
    const partner = partners.find(p => p.id === partnerId);
    return partner ? partner.name : '不明な取引先';
  };

  const resetFilters = () => {
    setFilters({
      partnerId: '',
      minAmount: '',
      maxAmount: '',
      status: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter size={18} />
          <span>フィルタ</span>
          {Object.values(filters).some(v => v !== '') && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
              適用中
            </span>
          )}
        </button>
      </div>

      {isFilterOpen && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">フィルタ条件</h3>
            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                リセット
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                取引先
              </label>
              <select
                value={filters.partnerId}
                onChange={(e) => setFilters(prev => ({ ...prev, partnerId: Number(e.target.value) || '' }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                {partners.map(partner => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                金額範囲
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: Number(e.target.value) || '' }))}
                  placeholder="最小"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span>〜</span>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: Number(e.target.value) || '' }))}
                  placeholder="最大"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ステータス
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as Order['status'] || '' }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                注文日範囲
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span>〜</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th
                  onClick={() => handleSort('id')}
                  className="group px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200/50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-1">
                    注文番号
                    {renderSortIcon('id')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('partnerId')}
                  className="group px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200/50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-1">
                    取引先
                    {renderSortIcon('partnerId')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('amount')}
                  className="group px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200/50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-1">
                    金額
                    {renderSortIcon('amount')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="group px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200/50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-1">
                    状態
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('orderDate')}
                  className="group px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200/50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-1">
                    注文日
                    {renderSortIcon('orderDate')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('deliveryDate')}
                  className="group px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200/50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-1">
                    納期
                    {renderSortIcon('deliveryDate')}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredAndSortedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => isEditableStatus(order.status) && onEdit(order)}
                  className={`transition-colors duration-150 ${
                    isEditableStatus(order.status)
                      ? 'cursor-pointer hover:bg-gray-50'
                      : 'cursor-default hover:bg-gray-50/50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {getPartnerName(order.partnerId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ¥{order.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => handleStatusClick(e, order)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full transition-opacity duration-150 ${
                        statusColors[order.status]
                      } ${canChangeStatus(order.status) ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}`}
                      disabled={!canChangeStatus(order.status)}
                      title={canChangeStatus(order.status) ? 'クリックしてステータスを変更' : 'このステータスは変更できません'}
                    >
                      {statusLabels[order.status]}
                      {canChangeStatus(order.status) && <ChevronDown size={14} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => handleView(e, order)}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-150"
                        title="詳細を表示"
                      >
                        <Eye size={18} />
                      </button>
                      {!isEditableStatus(order.status) && (
                        <span
                          className="text-gray-400 cursor-not-allowed"
                          title="このステータスでは編集できません"
                        >
                          <AlertCircle size={18} />
                        </span>
                      )}
                      {isDeletableStatus(order.status) && (
                        <button
                          onClick={(e) => handleDelete(e, order.id)}
                          className="text-rose-600 hover:text-rose-700 transition-colors duration-150"
                          title="削除"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isStatusDialogOpen && selectedOrder && (
        <StatusChangeDialog
          order={selectedOrder}
          onSubmit={handleStatusChange}
          onClose={() => {
            setIsStatusDialogOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}