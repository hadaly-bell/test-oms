import React from 'react';
import { Calendar, DollarSign, FileText, User } from 'lucide-react';
import type { Order, Partner } from '../types';

interface OrderFormProps {
  type: 'sale' | 'purchase';
  order?: Order;
  partners: Partner[];
  onSubmit: (data: Partial<Order>) => void;
  onCancel: () => void;
}

export function OrderForm({ type, order, partners, onSubmit, onCancel }: OrderFormProps) {
  const filteredPartners = partners.filter(partner => 
    type === 'sale' ? partner.type === 'customer' : partner.type === 'supplier'
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: Partial<Order> = {
      partnerId: Number(formData.get('partnerId')),
      type: type,
      amount: Number(formData.get('amount')),
      status: order?.status || 'pending',
      orderDate: formData.get('orderDate') as string,
      deliveryDate: formData.get('deliveryDate') as string || null,
      notes: formData.get('notes') as string,
    };
    
    onSubmit(data);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="partnerId" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <User size={18} />
            <span>取引先</span>
          </label>
          <select
            id="partnerId"
            name="partnerId"
            defaultValue={order?.partnerId}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            {filteredPartners.map(partner => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <DollarSign size={18} />
            <span>金額</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              name="amount"
              defaultValue={order?.amount}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-8"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="orderDate" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar size={18} />
            <span>注文日</span>
          </label>
          <input
            type="date"
            id="orderDate"
            name="orderDate"
            defaultValue={order?.orderDate?.split('T')[0] || today}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="deliveryDate" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar size={18} />
            <span>納期</span>
          </label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            defaultValue={order?.deliveryDate?.split('T')[0]}
            min={today}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-full space-y-2">
          <label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText size={18} />
            <span>備考</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={order?.notes}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {order ? '更新' : '登録'}
        </button>
      </div>
    </form>
  );
}