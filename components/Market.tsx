import React, { useState, useEffect, useRef } from 'react';
import { useStockData } from '../contexts/StockDataContext';
import { Stock } from '../types';
import { SearchIcon } from './icons/Icons';
import OrderModal from './OrderModal';
import StockAnalysisModal from './StockAnalysisModal';

interface MarketRowProps {
  stock: Stock;
  onSelectStock: (symbol: string) => void;
}

const MarketRow: React.FC<MarketRowProps> = ({ stock, onSelectStock }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [orderModalState, setOrderModalState] = useState<{ isOpen: boolean; side: 'BUY' | 'SELL' | null }>({ isOpen: false, side: null });
  
  const prevPriceRef = useRef(stock?.price);
  const [flashClass, setFlashClass] = useState('');

  useEffect(() => {
    if (stock && prevPriceRef.current !== stock.price && prevPriceRef.current !== undefined) {
      const flash = stock.price > prevPriceRef.current 
        ? 'bg-green-500/20' 
        : 'bg-red-500/20';
      setFlashClass(flash);
      const timer = setTimeout(() => setFlashClass(''), 500);
      prevPriceRef.current = stock.price;
      return () => clearTimeout(timer);
    }
     if (stock) {
        prevPriceRef.current = stock.price;
     }
  }, [stock?.price]);

  if (!stock) return null;
  
  const isPositive = stock.change >= 0;

  const handleOpenOrderModal = (e: React.MouseEvent, side: 'BUY' | 'SELL') => {
    e.stopPropagation();
    setOrderModalState({ isOpen: true, side });
  };
  const handleOpenAnalysisModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnalysisModalOpen(true);
  }
  const handleCloseOrderModal = () => setOrderModalState({ isOpen: false, side: null });
  const handleCloseAnalysisModal = () => setIsAnalysisModalOpen(false);

  return (
    <>
      <tr 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-500 ${flashClass}`}
      >
        <td className="p-3 cursor-pointer" onClick={() => onSelectStock(stock.symbol)}>
          <p className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{stock.symbol}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{stock.name}</p>
        </td>
        <td className="p-3 text-right">
          <p className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{stock.price.toFixed(2)}</p>
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </p>
        </td>
        <td className="p-3 text-right">{stock.volume?.toLocaleString('en-IN')}</td>
        <td className="p-3 text-right">{stock.open?.toFixed(2)}</td>
        <td className="p-3 text-right">{stock.high?.toFixed(2)}</td>
        <td className="p-3 text-right">{stock.low?.toFixed(2)}</td>
        <td className="p-3">
          {isHovered && (
             <div className="flex space-x-1 justify-center">
              <button onClick={(e) => handleOpenOrderModal(e, 'BUY')} className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700">B</button>
              <button onClick={(e) => handleOpenOrderModal(e, 'SELL')} className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700">S</button>
              <button onClick={handleOpenAnalysisModal} className="px-2 py-1 text-xs text-white bg-gray-600 rounded hover:bg-gray-700">AI</button>
            </div>
          )}
        </td>
      </tr>
      {isAnalysisModalOpen && <StockAnalysisModal stock={stock} onClose={handleCloseAnalysisModal} />}
      {orderModalState.isOpen && orderModalState.side && (
        <OrderModal stock={stock} side={orderModalState.side} onClose={handleCloseOrderModal} />
      )}
    </>
  )
}


const Market: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { stocks } = useStockData();

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Market Watch</h1>
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
            className="w-full max-w-sm pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200"
          />
        </div>
      </div>
      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-y-auto text-sm">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
            <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              <th className="p-3 text-left font-medium">Instrument</th>
              <th className="p-3 text-right font-medium">LTP</th>
              <th className="p-3 text-right font-medium">Volume</th>
              <th className="p-3 text-right font-medium">Open</th>
              <th className="p-3 text-right font-medium">High</th>
              <th className="p-3 text-right font-medium">Low</th>
              <th className="p-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map(stock => (
              <MarketRow key={stock.symbol} stock={stock} onSelectStock={onSelectStock} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Market;
