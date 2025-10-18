
import React, { useState } from 'react';
import MarketIndices from './MarketIndices';
import Holdings from './Holdings';
import Positions from './Positions';
import Watchlist from './Watchlist';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Holdings' | 'Positions'>('Positions');

  const TabButton: React.FC<{ label: 'Holdings' | 'Positions' }> = ({ label }) => (
    <button
      onClick={() => setActiveTab(label)}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
        activeTab === label
          ? 'text-blue-600 border-blue-600'
          : 'text-gray-500 border-transparent hover:text-gray-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex p-4 space-x-4 h-full">
      <div className="flex-1 flex flex-col">
        <MarketIndices />
        <div className="bg-white border border-gray-200 rounded-md mt-4 flex-1 flex flex-col">
          <div className="flex border-b border-gray-200">
            <TabButton label="Positions" />
            <TabButton label="Holdings" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'Positions' ? <Positions /> : <Holdings />}
          </div>
        </div>
      </div>
      <div className="w-80">
        <Watchlist />
      </div>
    </div>
  );
};

export default Dashboard;
