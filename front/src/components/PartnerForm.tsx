import React from 'react';
import type { Partner } from '../types';

interface PartnerFormProps {
  partner?: Partner;
  onSubmit: (data: Partial<Partner>) => void;
  onCancel: () => void;
}

export function PartnerForm({ partner, onSubmit, onCancel }: PartnerFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      representativeLastName: formData.get('representativeLastName') as string,
      representativeFirstName: formData.get('representativeFirstName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as 'supplier' | 'customer',
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            取引先名
          </label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={partner?.name}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="representativeLastName" className="block text-sm font-medium text-gray-700">
              担当者（姓）
            </label>
            <input
              type="text"
              name="representativeLastName"
              id="representativeLastName"
              defaultValue={partner?.representativeLastName}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="representativeFirstName" className="block text-sm font-medium text-gray-700">
              担当者（名）
            </label>
            <input
              type="text"
              name="representativeFirstName"
              id="representativeFirstName"
              defaultValue={partner?.representativeFirstName}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue={partner?.email}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            電話番号
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            defaultValue={partner?.phone}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            住所
          </label>
          <textarea
            name="address"
            id="address"
            defaultValue={partner?.address}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">取引先タイプ</label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="supplier"
                defaultChecked={partner?.type === 'supplier'}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">仕入先</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="customer"
                defaultChecked={partner?.type === 'customer'}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">販売先</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
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
          {partner ? '更新' : '登録'}
        </button>
      </div>
    </form>
  );
}