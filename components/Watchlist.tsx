import React, { useState } from 'react';
import { MOCK_WATCHLIST } from '../constants';
import { SearchIconLarge } from './icons/Icons';
import StockRow from './StockRow';
import { useStockData } from '../contexts/StockDataContext';

interface WatchlistProps {
  onSelectStock: (symbol: string) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ onSelectStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { getStockBySymbol } = useStockData();
  
  // Use original mock list to define what's in the watchlist
  const watchlistSymbols = MOCK_WATCHLIST.map(s => s.symbol);
  
  const watchlistStocks = watchlistSymbols
    .map(symbol => getStockBySymbol(symbol))
    .filter(stock => stock && stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md h-full flex flex-col">
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIconLarge />
          </span>
          <input
            type="text"
            placeholder="Search e.g. Infy, Reliance"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {watchlistStocks.map(stock => stock && (
          <StockRow key={stock.symbol} stockSymbol={stock.symbol} onSelectStock={onSelectStock} />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;