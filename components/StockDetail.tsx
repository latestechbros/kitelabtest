import React from 'react';
import { useStockData } from '../contexts/StockDataContext';
import StockChart from './StockChart';
import { Stock } from '../types';

interface StockDetailProps {
  stockSymbol: string;
  onBack: () => void;
}

const DataPill: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm font-medium">{value ?? 'N/A'}</p>
  </div>
);

const StockDetail: React.FC<StockDetailProps> = ({ stockSymbol, onBack }) => {
  const { getStockBySymbol } = useStockData();
  const stock = getStockBySymbol(stockSymbol);

  if (!stock) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Stock not found</h1>
        <button onClick={onBack} className="text-blue-600 hover:underline mt-4">
          &larr; Back to dashboard
        </button>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <button onClick={onBack} className="text-sm text-blue-600 hover:underline mb-2">
            &larr; Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stock.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stock.symbol}</p>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {stock.price.toFixed(2)}
          </p>
          <p className={`text-md font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-6">
        <StockChart data={stock.history ?? []} isPositive={isPositive} />
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
        <h2 className="text-lg font-semibold mb-3">Market Depth</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center md:text-left">
            <DataPill label="Open" value={stock.open?.toFixed(2)} />
            <DataPill label="High" value={stock.high?.toFixed(2)} />
            <DataPill label="Low" value={stock.low?.toFixed(2)} />
            <DataPill label="Prev. Close" value={stock.prevClose?.toFixed(2)} />
            <DataPill label="Volume" value={stock.volume?.toLocaleString('en-IN')} />
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
