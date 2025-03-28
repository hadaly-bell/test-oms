import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Search, Filter, X, Eye } from 'lucide-react';
import { Drawer } from '../components/Drawer';
import { UserDetail } from '../components/UserDetail';
import type { User } from '../types';

// モックユーザーデータ
const mockUsers: User[] = [
  {
    id: 1,
    email: 'yamada.taro@example.com',
    lastName: '山田',
    firstName: '太郎',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    email: 'suzuki.hanako@example.com',
    lastName: '鈴木',
    firstName: '花子',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 3,
    email: 'tanaka.ichiro@example.com',
    lastName: '田中',
    firstName: '一郎',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
];

interface UserFormData {
  email: string;
  lastName: string;
  firstName: string;
  role: 'admin' | 'user';
  password?: string;
}

export function AccountPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: '' as '' | 'admin' | 'user',
    startDate: '',
    endDate: '',
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = `${user.lastName}${user.firstName}${user.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesRole = !filters.role || user.role === filters.role;
      
      const matchesDate = (!filters.startDate || new Date(user.createdAt) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(user.createdAt) <= new Date(filters.endDate));

      return matchesSearch && matchesRole && matchesDate;
    });
  }, [users, searchQuery, filters]);

  const handleAdd = () => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('このユーザーを削除してもよろしいですか？')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleRoleChange = (userId: number, newRole: 'admin' | 'user') => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, role: newRole, updatedAt: new Date().toISOString() }
        : user
    ));
  };

  const handleSubmit = (data: UserFormData) => {
    if (selectedUser) {
      setUsers(users.map(user =>
        user.id === selectedUser.id
          ? { ...selectedUser, ...data, updatedAt: new Date().toISOString() }
          : user
      ));
    } else {
      const newUser: User = {
        id: Math.max(...users.map(user => user.id)) + 1,
        ...data,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
    }
    setIsDrawerOpen(false);
  };

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailDrawerOpen(true);
  };

  const resetFilters = () => {
    setFilters({
      role: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ユーザーを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
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
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>ユーザーを追加</span>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                権限
              </label>
              <select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as typeof filters.role }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                <option value="admin">管理者</option>
                <option value="user">ユーザー</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                作成日範囲
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                ユーザー
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                メールアドレス
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                権限
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                作成日
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="transition-colors duration-150 hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={user.avatarUrl || 'https://via.placeholder.com/128'}
                      alt={`${user.lastName} ${user.firstName}のアバター`}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.lastName} {user.firstName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user')}
                    className={`text-xs font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 focus:ring-purple-500'
                        : 'bg-slate-100 text-slate-800 focus:ring-slate-500'
                    }`}
                  >
                    <option value="admin">管理者</option>
                    <option value="user">ユーザー</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleViewDetail(user)}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-150"
                      title="詳細を表示"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-rose-600 hover:text-rose-700 transition-colors duration-150"
                      title="削除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        title="アカウント詳細"
      >
        {selectedUser && (
          <UserDetail
            user={selectedUser}
            onClose={() => setIsDetailDrawerOpen(false)}
          />
        )}
      </Drawer>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedUser ? 'ユーザーを編集' : '新規ユーザーを登録'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit({
              email: formData.get('email') as string,
              lastName: formData.get('lastName') as string,
              firstName: formData.get('firstName') as string,
              role: formData.get('role') as 'admin' | 'user',
              ...(selectedUser ? {} : { password: formData.get('password') as string }),
            });
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                姓
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                defaultValue={selectedUser?.lastName}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                名
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                defaultValue={selectedUser?.firstName}
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
              defaultValue={selectedUser?.email}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {!selectedUser && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              権限
            </label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  defaultChecked={selectedUser?.role === 'admin'}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">管理者</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  defaultChecked={selectedUser?.role === 'user' || !selectedUser}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">ユーザー</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              {selectedUser ? '更新' : '登録'}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}