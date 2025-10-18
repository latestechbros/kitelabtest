import React from 'react';
import { UserIcon, LogoutIcon, SunIcon, MoonIcon } from './icons/Icons';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-end px-6 space-x-6 text-sm">
      <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500">Dashboard</button>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} title="Toggle Theme" className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-blue-600 dark:text-blue-500 cursor-pointer">
                <UserIcon />
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">AB1234</span>
        </div>
        <button onClick={onLogout} title="Logout" className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <LogoutIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
