import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface ProfileFormData {
  lastName: string;
  firstName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function SettingsPage() {
  // モックユーザー情報
  const [currentUser, setCurrentUser] = useState({
    lastName: '山田',
    firstName: '太郎',
    email: 'yamada.taro@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });

  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<ProfileFormData>>({});

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      lastName: formData.get('lastName') as string,
      firstName: formData.get('firstName') as string,
      email: formData.get('email') as string,
    };

    // バリデーション
    const errors: Partial<ProfileFormData> = {};
    if (!data.lastName) errors.lastName = '姓を入力してください';
    if (!data.firstName) errors.firstName = '名を入力してください';
    if (!data.email) errors.email = 'メールアドレスを入力してください';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // プロフィール更新処理
    setCurrentUser(prev => ({
      ...prev,
      ...data,
    }));

    alert('プロフィールを更新しました');
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // バリデーション
    const errors: Partial<ProfileFormData> = {};
    if (!data.currentPassword) errors.currentPassword = '現在のパスワードを入力してください';
    if (!data.newPassword) errors.newPassword = '新しいパスワードを入力してください';
    if (!data.confirmPassword) errors.confirmPassword = '確認用パスワードを入力してください';
    if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = '新しいパスワードと確認用パスワードが一致しません';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // パスワード更新処理
    alert('パスワードを更新しました');
    setIsPasswordFormVisible(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 実際のアプリケーションではここでファイルアップロード処理を行う
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentUser(prev => ({
          ...prev,
          avatarUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">プロフィール設定</h2>
        
        <div className="mb-8">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt="プロフィール画像"
                className="h-24 w-24 rounded-full object-cover"
              />
              <label
                htmlFor="avatar-input"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50"
              >
                <Camera size={16} className="text-gray-600" />
                <input
                  type="file"
                  id="avatar-input"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div className="ml-6">
              <h3 className="text-lg font-medium text-gray-900">
                {currentUser.lastName} {currentUser.firstName}
              </h3>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                姓
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                defaultValue={currentUser.lastName}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formErrors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.lastName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
              )}
            </div>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                名
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                defaultValue={currentUser.firstName}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.firstName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
              )}
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
              defaultValue={currentUser.email}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formErrors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              保存
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">パスワード設定</h2>
        
        {!isPasswordFormVisible ? (
          <button
            onClick={() => setIsPasswordFormVisible(true)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            パスワードを変更
          </button>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                現在のパスワード
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                新しいパスワード
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                新しいパスワード（確認）
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsPasswordFormVisible(false);
                  setFormErrors({});
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                パスワードを変更
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}