import React, { useState, useEffect, useRef } from 'react';
import { UserIcon, LogoutIcon, SunIcon, MoonIcon, SearchIcon as SearchIconSmall } from './icons/Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useStockData } from '../contexts/StockDataContext';
import { Stock } from '../types';

interface HeaderProps {
    onLogout: () => void;
    onSelectStock: (symbol: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onSelectStock }) => {
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const { stocks } = useStockData();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
        const results = stocks.filter(stock => 
            stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 7); // Limit results to 7
        setSearchResults(results);
    } else {
        setSearchResults([]);
    }
  }, [searchTerm, stocks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setSearchResults([]);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (symbol: string) => {
      onSelectStock(symbol);
      setSearchTerm('');
      setSearchResults([]);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 space-x-6 text-sm">
      <div ref={searchContainerRef} className="relative flex-1 max-w-md">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIconSmall />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search e.g. Infy, Reliance..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        {searchResults.length > 0 && (
          <ul className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 overflow-hidden">
            {searchResults.map(stock => (
              <li 
                key={stock.symbol} 
                onClick={() => handleSelect(stock.symbol)} 
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
              >
                <div className="flex flex-col">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{stock.symbol}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{stock.name}</span>
                </div>
                <span className={`text-xs font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

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