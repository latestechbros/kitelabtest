import React, { useState } from 'react';
import { Stock } from '../types';
import StockAnalysisModal from './StockAnalysisModal';
import OrderModal from './OrderModal';

const StockRow: React.FC<{ stock: Stock }> = ({ stock }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [orderModalState, setOrderModalState] = useState<{ isOpen: boolean; side: 'BUY' | 'SELL' | null }>({ isOpen: false, side: null });

  const isPositive = stock.change >= 0;

  const handleOpenOrderModal = (side: 'BUY' | 'SELL') => {
    setOrderModalState({ isOpen: true, side });
  };

  const handleCloseOrderModal = () => {
    setOrderModalState({ isOpen: false, side: null });
  };

  return (
    <>
      <div
        className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 text-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-1">
          <p className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{stock.symbol}</p>
          <p className="text-xs text-gray-500 truncate">{stock.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right w-24">
            <p className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{stock.price.toFixed(2)}</p>
            <p className="text-xs text-gray-500">
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </p>
          </div>
          {isHovered && (
            <div className="flex space-x-1">
              <button onClick={() => handleOpenOrderModal('BUY')} className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700">B</button>
              <button onClick={() => handleOpenOrderModal('SELL')} className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700">S</button>
              <button onClick={() => setIsAnalysisModalOpen(true)} className="px-2 py-1 text-xs text-white bg-gray-600 rounded hover:bg-gray-700">AI</button>
            </div>
          )}
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
