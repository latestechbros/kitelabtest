
import React, { useState } from 'react';
import { MOCK_WATCHLIST } from '../constants';
import { Stock } from '../types';
import { SearchIcon } from './icons/Icons';
import StockRow from './StockRow';

const Watchlist: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = MOCK_WATCHLIST.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-200 rounded-md h-full flex flex-col">
      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search e.g. Infy, Reliance"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredStocks.map(stock => (
          <StockRow key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
