import React, { useState } from 'react';
import { PartnerList } from '../components/PartnerList';
import { PartnerForm } from '../components/PartnerForm';
import type { Partner } from '../types';

// モックデータ
const mockPartners: Partner[] = [
  {
    id: 1,
    name: '株式会社サンプル',
    representativeLastName: '山田',
    representativeFirstName: '太郎',
    email: 'yamada@example.com',
    phone: '03-1234-5678',
    address: '東京都渋谷区...',
    type: 'supplier',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 2,
    name: '株式会社テスト',
    representativeLastName: '鈴木',
    representativeFirstName: '一郎',
    email: 'suzuki@example.com',
    phone: '03-8765-4321',
    address: '大阪府大阪市...',
    type: 'customer',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
];

export function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAdd = () => {
    setSelectedPartner(null);
    setIsFormOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      setPartners(partners.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (data: Partial<Partner>) => {
    if (selectedPartner) {
      setPartners(partners.map(p => 
        p.id === selectedPartner.id 
          ? { ...selectedPartner, ...data, updatedAt: new Date().toISOString() }
          : p
      ));
    } else {
      const newPartner: Partner = {
        id: Math.max(...partners.map(p => p.id)) + 1,
        ...data as Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPartners([...partners, newPartner]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {isFormOpen ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedPartner ? '取引先を編集' : '新規取引先を登録'}
          </h2>
          <PartnerForm
            partner={selectedPartner ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      ) : (
        <PartnerList
          partners={partners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}