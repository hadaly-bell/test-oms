import React from 'react';
import { Mail, Key, AlertCircle } from 'lucide-react';
import type { User } from '../types';
import { useToastContext } from '../context/ToastContext';

interface UserDetailProps {
  user: User;
  onClose: () => void;
}

export function UserDetail({ user, onClose }: UserDetailProps) {
  const { showToast } = useToastContext();

  const handlePasswordReset = async () => {
    if (!confirm(`${user.lastName} ${user.firstName}さんのパスワードを再発行しますか？`)) {
      return;
    }

    try {
      // TODO: パスワード再発行APIの呼び出し
      // const response = await resetPassword(user.id);
      
      showToast('success', 'パスワードを再発行し、ユーザーにメールで通知しました');
    } catch (error) {
      showToast('error', 'パスワードの再発行に失敗しました');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-gray-900">
          アカウント詳細
        </h3>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          閉じる
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <img
              src={user.avatarUrl || 'https://via.placeholder.com/128'}
              alt={`${user.lastName} ${user.firstName}のアバター`}
              className="h-16 w-16 rounded-full"
            />
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">
                {user.lastName} {user.firstName}
              </h4>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4">
            <div className="flex items-center py-3 border-t border-gray-100">
              <dt className="flex items-center text-sm font-medium text-gray-500 w-32">
                <Mail className="w-4 h-4 mr-2" />
                メールアドレス
              </dt>
              <dd className="text-sm text-gray-900">{user.email}</dd>
            </div>
            <div className="flex items-center py-3 border-t border-gray-100">
              <dt className="flex items-center text-sm font-medium text-gray-500 w-32">
                <Key className="w-4 h-4 mr-2" />
                パスワード
              </dt>
              <dd className="flex items-center">
                <span className="text-sm text-gray-500 mr-4">********</span>
                <button
                  onClick={handlePasswordReset}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  再発行
                </button>
              </dd>
            </div>
            <div className="flex items-center py-3 border-t border-gray-100">
              <dt className="flex items-center text-sm font-medium text-gray-500 w-32">
                <AlertCircle className="w-4 h-4 mr-2" />
                アカウント状態
              </dt>
              <dd>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role === 'admin' ? '管理者' : 'ユーザー'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}