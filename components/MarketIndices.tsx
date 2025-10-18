
import React from 'react';
import { MOCK_INDICES } from '../constants';
import { Index } from '../types';

const IndexCard: React.FC<{ index: Index }> = ({ index }) => {
  const isPositive = index.change >= 0;
  return (
    <div className="flex-1">
      <h3 className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {index.symbol}
      </h3>
      <p className="text-gray-800 font-medium">{index.price.toFixed(2)}</p>
      <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
      </p>
    </div>
  );
};

const MarketIndices: React.FC = () => {
  return (
    <div className="flex bg-white border border-gray-200 rounded-md p-4 space-x-4">
      {MOCK_INDICES.map(index => (
        <IndexCard key={index.symbol} index={index} />
      ))}
    </div>
  );
};

export default MarketIndices;
