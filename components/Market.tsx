import React, { useState } from 'react';
import { MOCK_ALL_STOCKS } from '../constants';
import { Stock } from '../types';
import StockRow from './StockRow';
import { SearchIcon } from './icons/Icons';

const Market: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = MOCK_ALL_STOCKS.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Market Watch</h1>
       <div className="mb-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search e.g. Infy, Reliance, Tata Motors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 bg-white border border-gray-200 rounded-md overflow-y-auto">
        {filteredStocks.map(stock => (
          <StockRow key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  );
};

export default Market;
