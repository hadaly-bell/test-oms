import React, { useState } from 'react';
import { LayoutDashboard, Users, ShoppingCart, Truck, UserCircle, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuItems = [
    { path: '/sales', label: '受注', icon: ShoppingCart },
    { path: '/purchases', label: '発注', icon: Truck },
    { path: '/partners', label: '取引先', icon: Users },
    { path: '/account', label: 'アカウント管理', icon: UserCircle },
    { path: '/settings', label: '設定', icon: Settings },
  ];

  // モックユーザー情報
  const currentUser = {
    name: '山田 太郎',
    email: 'yamada.taro@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  };

  const handleLogout = () => {
    // ログアウト処理
    console.log('Logout');
  };

  return (
    <div className="min-h-screen flex">
      {/* サイドバー */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <LayoutDashboard size={24} />
            <span>取引管理システム</span>
          </Link>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'ダッシュボード'}
            </h1>

            {/* ユーザーメニュー */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <span className="text-sm text-gray-700">{currentUser.name}</span>
                <img
                  src={currentUser.avatarUrl}
                  alt="ユーザーアバター"
                  className="w-8 h-8 rounded-full"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings size={16} />
                    <span>設定</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} />
                    <span>ログアウト</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}