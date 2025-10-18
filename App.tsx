
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Holdings from './components/Holdings';
import Positions from './components/Positions';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('Dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'Orders':
        return <Orders />;
      case 'Holdings':
        return <Holdings />;
      case 'Positions':
        return <Positions />;
      case 'Dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
