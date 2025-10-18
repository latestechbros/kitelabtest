import React from 'react';
import { useStockData } from '../contexts/StockDataContext';
import { Position } from '../types';

const Positions: React.FC = () => {
  const { positions } = useStockData();
  const totalPnl = positions.reduce((acc, p) => acc + p.pnl, 0);

  const PnlText: React.FC<{ value: number }> = ({ value }) => {
    const isPositive = value >= 0;
    return (
        <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {isPositive ? '+' : ''}{value.toFixed(2)}
        </span>
    );
  };
    
  return (
    <div className="p-4 text-sm bg-white dark:bg-gray-800 h-full">
      <div className="grid grid-cols-6 gap-4 py-2 px-3 text-gray-500 dark:text-gray-400 font-medium border-b dark:border-gray-700">
        <div className="col-span-2">Instrument</div>
        <div>Qty.</div>
        <div>Avg. cost</div>
        <div>LTP</div>
        <div>P&L</div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {positions.map((position: Position) => (
          <div key={position.symbol} className="grid grid-cols-6 gap-4 py-3 px-3 items-center">
            <div className="col-span-2 font-medium text-gray-800 dark:text-gray-200">{position.symbol}</div>
            <div>{position.qty}</div>
            <div>{position.avgPrice.toFixed(2)}</div>
            <div>{position.ltp.toFixed(2)}</div>
            <div><PnlText value={position.pnl} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-4 py-4 px-3 font-bold border-t-2 dark:border-gray-700 mt-4">
        <div className="col-span-5 text-right">Total P&L</div>
        <div><PnlText value={totalPnl} /></div>
      </div>
    </div>
  );
};

export default Positions;
