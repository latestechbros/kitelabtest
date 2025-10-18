import React from 'react';
import { UserIcon, LogoutIcon } from './icons/Icons';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-6 space-x-6 text-sm">
      <button className="text-gray-600 hover:text-blue-600">Dashboard</button>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-100 rounded-full text-blue-600 cursor-pointer">
                <UserIcon />
            </div>
            <span className="font-medium text-gray-700">AB1234</span>
        </div>
        <button onClick={onLogout} title="Logout" className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full">
            <LogoutIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
