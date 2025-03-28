import { useState, useEffect } from 'react';
import { PartnerList } from '../components/PartnerList';
import { PartnerForm } from '../components/PartnerForm';
import type { Partner } from '../types';
import { partnerApi } from '../services/api';
import { useToast } from '../hooks/useToast';

export function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  
  useEffect(() => {
    (window as any).partners = partners;
    (window as any).isLoading = isLoading;
    console.log('Debug partners state in PartnersPage:', partners);
    console.log('Debug isLoading state in PartnersPage:', isLoading);
  }, [partners, isLoading]);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching partners...');
      const response = await fetch('http://localhost:3000/api/v1/partners');
      const data = await response.json();
      console.log('Raw partners data:', data);
      
      const convertedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        representativeLastName: item.representative_last_name,
        representativeFirstName: item.representative_first_name,
        email: item.email,
        phone: item.phone,
        address: item.address,
        type: item.partner_type,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      
      console.log('Converted partners data:', convertedData);
      setPartners(convertedData);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      addToast('error', '取引先データの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAdd = () => {
    setSelectedPartner(null);
    setIsFormOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        await partnerApi.delete(id);
        setPartners(partners.filter(p => p.id !== id));
        addToast('success', '取引先を削除しました。');
      } catch (error) {
        console.error('Failed to delete partner:', error);
        addToast('error', '取引先の削除に失敗しました。');
      }
    }
  };

  const handleSubmit = async (data: Partial<Partner>) => {
    try {
      if (selectedPartner) {
        const updatedPartner = await partnerApi.update(selectedPartner.id, data);
        setPartners(partners.map(p => 
          p.id === selectedPartner.id ? updatedPartner : p
        ));
        addToast('success', '取引先情報を更新しました。');
      } else {
        const newPartner = await partnerApi.create(data as Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>);
        setPartners([...partners, newPartner]);
        addToast('success', '新規取引先を登録しました。');
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save partner:', error);
      addToast('error', '取引先の保存に失敗しました。');
    }
  };

  console.log('Rendering PartnersPage with partners:', partners);
  
  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isFormOpen ? (
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
        <>
          {partners && partners.length > 0 ? (
            <PartnerList
              partners={partners}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">取引先一覧</h2>
              <p className="text-gray-600">取引先データがありません。新規登録ボタンから追加してください。</p>
              <button
                onClick={handleAdd}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>新規登録</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
