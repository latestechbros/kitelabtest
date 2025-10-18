import React, { useEffect, useState, useRef } from 'react';
import { useStockData } from '../contexts/StockDataContext';
import { Index } from '../types';

const IndexCard: React.FC<{ indexData: Index }> = ({ indexData }) => {
  const isPositive = indexData.change >= 0;
  const prevPriceRef = useRef(indexData.price);
  const [flashClass, setFlashClass] = useState('');

  useEffect(() => {
    if (prevPriceRef.current !== indexData.price && prevPriceRef.current !== 0) {
      const flash = indexData.price > prevPriceRef.current 
        ? 'bg-green-500/20' 
        : 'bg-red-500/20';
      setFlashClass(flash);
      const timer = setTimeout(() => setFlashClass(''), 500);
      prevPriceRef.current = indexData.price;
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = indexData.price;
  }, [indexData.price]);

  return (
    <div className={`flex-1 p-2 rounded-md transition-colors duration-500 ${flashClass}`}>
      <h3 className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {indexData.symbol}
      </h3>
      <p className="text-gray-800 dark:text-gray-200 font-medium">{indexData.price.toFixed(2)}</p>
      <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{indexData.change.toFixed(2)} ({indexData.changePercent.toFixed(2)}%)
      </p>
    </div>
  );
};

const MarketIndices: React.FC = () => {
  const { indices } = useStockData();
  return (
    <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 space-x-2">
      {indices.map(index => (
        <IndexCard key={index.symbol} indexData={index} />
      ))}
    </div>
  );
};

export default MarketIndices;
