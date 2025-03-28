import React from 'react';
import { Building2, Phone, Mail, Trash2, Plus } from 'lucide-react';
import type { Partner } from '../types';

interface PartnerListProps {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export function PartnerList({ partners, onEdit, onDelete, onAdd }: PartnerListProps) {
  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">取引先一覧</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>新規登録</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            onClick={() => onEdit(partner)}
            className="bg-white rounded-lg shadow-md p-6 space-y-4 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900">{partner.name}</h3>
              <span className={`px-2 py-1 rounded-full text-sm ${
                partner.type === 'supplier' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {partner.type === 'supplier' ? '仕入先' : '販売先'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 size={18} />
                <span>{partner.representativeLastName} {partner.representativeFirstName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={18} />
                <span>{partner.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={18} />
                <span>{partner.email}</span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={(e) => handleDelete(e, partner.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="削除"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}