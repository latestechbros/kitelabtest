import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Holdings from './components/Holdings';
import Positions from './components/Positions';
import Funds from './components/Funds';
import Market from './components/Market';
import Login from './components/Login';
import MFAPin from './components/MFAPin';
import { View } from './types';

type AuthState = 'login' | 'pin' | 'authenticated';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [authState, setAuthState] = useState<AuthState>('login');

  const handleLoginSuccess = () => {
    setAuthState('pin');
  };

  const handlePinSuccess = () => {
    setAuthState('authenticated');
  };
  
  const handleLogout = () => {
    setAuthState('login');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Orders':
        return <Orders />;
      case 'Holdings':
        return <Holdings />;
      case 'Positions':
        return <Positions />;
      case 'Funds':
        return <Funds />;
      case 'Market':
          return <Market />;
      case 'Dashboard':
      default:
        return <Dashboard />;
    }
  };

  if (authState === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (authState === 'pin') {
    return <MFAPin onPinSuccess={handlePinSuccess} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1">
        <Header onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
