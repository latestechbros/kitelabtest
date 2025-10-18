import React, { useState, useEffect, useRef } from 'react';
import StockAnalysisModal from './StockAnalysisModal';
import OrderModal from './OrderModal';
import { useStockData } from '../contexts/StockDataContext';

interface StockRowProps {
  stockSymbol: string;
  onSelectStock: (symbol: string) => void;
}

const StockRow: React.FC<StockRowProps> = ({ stockSymbol, onSelectStock }) => {
  const { getStockBySymbol } = useStockData();
  const stock = getStockBySymbol(stockSymbol);

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

  const handleCloseOrderModal = () => {
    setOrderModalState({ isOpen: false, side: null });
  };
  
  const handleOpenAnalysisModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnalysisModalOpen(true);
  }

  return (
    <>
      <div
        className={`flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm transition-colors duration-500 ${flashClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelectStock(stock.symbol)}
        role="button"
        tabIndex={0}
      >
        <div className="flex-1 truncate">
          <p className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{stock.symbol}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{stock.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right w-24">
            <p className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{stock.price.toFixed(2)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </p>
          </div>
          <div className="w-28 text-right">
          {isHovered && (
            <div className="flex space-x-1">
              <button onClick={(e) => handleOpenOrderModal(e, 'BUY')} className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700">B</button>
              <button onClick={(e) => handleOpenOrderModal(e, 'SELL')} className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700">S</button>
              <button onClick={handleOpenAnalysisModal} className="px-2 py-1 text-xs text-white bg-gray-600 rounded hover:bg-gray-700">AI</button>
            </div>
          )}
          </div>
        </div>
      </div>
      {isAnalysisModalOpen && <StockAnalysisModal stock={stock} onClose={() => setIsAnalysisModalOpen(false)} />}
      {orderModalState.isOpen && orderModalState.side && (
        <OrderModal stock={stock} side={orderModalState.side} onClose={handleCloseOrderModal} />
      )}
    </>
  );
};

export default StockRow;
