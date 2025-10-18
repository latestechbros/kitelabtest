import React from 'react';
import { useStockData } from '../contexts/StockDataContext';
import { Holding } from '../types';

const Holdings: React.FC = () => {
    const { holdings } = useStockData();
    
    const totalCurrentValue = holdings.reduce((acc, h) => acc + h.currentValue, 0);
    const totalPnl = holdings.reduce((acc, h) => acc + h.pnl, 0);
    const totalDayChange = holdings.reduce((acc, h) => acc + (h.dayChange * h.qty), 0);
    const totalInvestment = totalCurrentValue - totalPnl;

  const PnlText: React.FC<{ value: number, percent?: number }> = ({ value, percent }) => {
    const isPositive = value >= 0;
    return (
        <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {isPositive ? '+' : ''}{value.toFixed(2)}
            {percent !== undefined && <span className="text-xs ml-1">({percent.toFixed(2)}%)</span>}
        </span>
    );
  };
    
  return (
    <div className="p-4 text-sm bg-white dark:bg-gray-800 h-full">
      <div className="grid grid-cols-7 gap-4 py-2 px-3 text-gray-500 dark:text-gray-400 font-medium border-b dark:border-gray-700">
        <div className="col-span-2">Instrument</div>
        <div>Qty.</div>
        <div>Avg. cost</div>
        <div>LTP</div>
        <div>Cur. val</div>
        <div>P&L</div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {holdings.map((holding: Holding) => (
          <div key={holding.symbol} className="grid grid-cols-7 gap-4 py-3 px-3 items-center">
            <div className="col-span-2 font-medium text-gray-800 dark:text-gray-200">{holding.symbol}</div>
            <div>{holding.qty}</div>
            <div>{holding.avgPrice.toFixed(2)}</div>
            <div>{holding.ltp.toFixed(2)}</div>
            <div>{holding.currentValue.toFixed(2)}</div>
            <div><PnlText value={holding.pnl} percent={holding.pnlPercent} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4 py-4 px-3 font-bold border-t-2 dark:border-gray-700 mt-4">
        <div className="col-span-5 text-right">Total Investment</div>
        <div>{totalInvestment.toFixed(2)}</div>
        <div><PnlText value={totalPnl} /></div>
      </div>
      <div className="grid grid-cols-7 gap-4 py-2 px-3 font-bold">
        <div className="col-span-5 text-right">Current Value</div>
        <div>{totalCurrentValue.toFixed(2)}</div>
        <div/>
      </div>
       <div className="grid grid-cols-7 gap-4 py-2 px-3 font-bold">
        <div className="col-span-5 text-right">Day's P&L</div>
        <div/>
        <div><PnlText value={totalDayChange} /></div>
      </div>
    </div>
  );
};

export default Holdings;
