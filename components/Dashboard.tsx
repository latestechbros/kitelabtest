import React, { useState } from 'react';
import MarketIndices from './MarketIndices';
import Holdings from './Holdings';
import Positions from './Positions';
import Watchlist from './Watchlist';

interface DashboardProps {
  onSelectStock: (symbol: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectStock }) => {
  const [activeTab, setActiveTab] = useState<'Holdings' | 'Positions'>('Positions');

  const TabButton: React.FC<{ label: 'Holdings' | 'Positions' }> = ({ label }) => (
    <button
      onClick={() => setActiveTab(label)}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
        activeTab === label
          ? 'text-blue-600 border-blue-600'
          : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex p-4 space-x-4 h-full">
      <div className="flex-1 flex flex-col">
        <MarketIndices />
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md mt-4 flex-1 flex flex-col">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <TabButton label="Positions" />
            <TabButton label="Holdings" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'Positions' ? <Positions /> : <Holdings />}
          </div>
        </div>
      </div>
      <div className="w-80">
        <Watchlist onSelectStock={onSelectStock} />
      </div>
    </div>
  );
};

export default Dashboard;
