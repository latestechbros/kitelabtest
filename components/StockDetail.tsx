import React, { useState } from 'react';
import { useStockData } from '../contexts/StockDataContext';
import StockChart from './StockChart';
import MarketDepth from './MarketDepth';
import { Stock } from '../types';

interface StockDetailProps {
  stockSymbol: string;
  onBack: () => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y';

const DataPill: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm font-medium">{value ?? 'N/A'}</p>
  </div>
);

const StockDetail: React.FC<StockDetailProps> = ({ stockSymbol, onBack }) => {
  const { getStockBySymbol } = useStockData();
  const stock = getStockBySymbol(stockSymbol);
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');

  const timeframeOptions: { label: Timeframe; days: number }[] = [
    { label: '1D', days: 2 },
    { label: '5D', days: 5 },
    { label: '1M', days: 30 },
    { label: '6M', days: 180 },
    { label: '1Y', days: 365 },
  ];

  const getChartData = () => {
    if (!stock?.history) return [];
    const days = timeframeOptions.find(t => t.label === timeframe)?.days ?? 30;
    return stock.history.slice(Math.max(0, stock.history.length - days));
  };


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
      
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-1 rounded-md bg-gray-100 dark:bg-gray-900/50 p-1">
                        {timeframeOptions.map(opt => (
                            <button
                                key={opt.label}
                                onClick={() => setTimeframe(opt.label)}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                                    timeframe === opt.label
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <StockChart data={getChartData()} isPositive={isPositive} />
            </div>
        </div>
        <div className="w-full lg:w-72">
            <MarketDepth bids={stock.bids ?? []} asks={stock.asks ?? []} />
        </div>
      </div>


      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 mt-6">
        <h2 className="text-lg font-semibold mb-3">Market Info</h2>
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
