
import React from 'react';
import { View } from '../types';
import { DashboardIcon, OrdersIcon, HoldingsIcon, PositionsIcon, FundsIcon, AppsIcon } from './icons/Icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  label: View;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center h-16 w-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200 relative ${
      isActive ? 'text-blue-600' : ''
    }`}
    title={label}
  >
    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
    {children}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems: { label: View; icon: React.ReactNode }[] = [
    { label: 'Dashboard', icon: <DashboardIcon /> },
    { label: 'Orders', icon: <OrdersIcon /> },
    { label: 'Holdings', icon: <HoldingsIcon /> },
    { label: 'Positions', icon: <PositionsIcon /> },
    { label: 'Funds', icon: <FundsIcon /> },
    { label: 'Apps', icon: <AppsIcon /> },
  ];

  return (
    <nav className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <img src="https://kite.zerodha.com/static/images/kite-logo.svg" alt="Kite Logo" className="w-7 h-7 mb-8" />
      <div className="w-full">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            isActive={activeView === item.label}
            onClick={() => setActiveView(item.label)}
          >
            {item.icon}
          </NavItem>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
