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
import StockDetail from './components/StockDetail';
import { View } from './types';

type AuthState = 'login' | 'pin' | 'authenticated';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [authState, setAuthState] = useState<AuthState>('login');
  const [detailedStockSymbol, setDetailedStockSymbol] = useState<string | null>(null);

  const handleLoginSuccess = () => {
    setAuthState('pin');
  };

  const handlePinSuccess = () => {
    setAuthState('authenticated');
  };
  
  const handleLogout = () => {
    setAuthState('login');
    setDetailedStockSymbol(null);
    setActiveView('Dashboard');
  };
  
  const handleSelectStock = (symbol: string) => {
    setDetailedStockSymbol(symbol);
  };

  const handleBackFromDetail = () => {
    setDetailedStockSymbol(null);
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
        return <Market onSelectStock={handleSelectStock} />;
      case 'Dashboard':
      default:
        return <Dashboard onSelectStock={handleSelectStock} />;
    }
  };

  if (authState === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (authState === 'pin') {
    return <MFAPin onPinSuccess={handlePinSuccess} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1">
        <Header onLogout={handleLogout} onSelectStock={handleSelectStock} />
        <main className="flex-1 overflow-y-auto">
          {detailedStockSymbol ? (
            <StockDetail stockSymbol={detailedStockSymbol} onBack={handleBackFromDetail} />
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default App;