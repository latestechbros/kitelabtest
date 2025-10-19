import React from 'react';
import { MarketDepthItem } from '../types';

interface MarketDepthProps {
  bids: MarketDepthItem[];
  asks: MarketDepthItem[];
}

const MarketDepthRow: React.FC<{ item: MarketDepthItem; type: 'bid' | 'ask'; totalQty: number }> = ({ item, type, totalQty }) => {
  const isBid = type === 'bid';
  const percentage = (item.qty / totalQty) * 100;

  return (
    <div className={`grid grid-cols-3 gap-2 text-xs relative ${isBid ? 'text-right' : 'text-left'}`}>
      <div className={`absolute top-0 h-full ${isBid ? 'right-0 bg-blue-500/20' : 'left-0 bg-red-500/20'}`} style={{ width: `${percentage}%` }}></div>
      {isBid ? (
        <>
          <span className="z-10 text-blue-600 dark:text-blue-400">{item.qty.toLocaleString()}</span>
          <span className="z-10">{item.orders}</span>
          <span className="z-10 font-semibold">{item.price.toFixed(2)}</span>
        </>
      ) : (
        <>
          <span className="z-10 font-semibold">{item.price.toFixed(2)}</span>
          <span className="z-10">{item.orders}</span>
          <span className="z-10 text-red-600 dark:text-red-400">{item.qty.toLocaleString()}</span>
        </>
      )}
    </div>
  );
};


const MarketDepth: React.FC<MarketDepthProps> = ({ bids, asks }) => {
  const totalBidQty = bids.reduce((acc, b) => acc + b.qty, 0);
  const totalAskQty = asks.reduce((acc, a) => acc + a.qty, 0);
  const maxQty = Math.max(totalBidQty, totalAskQty);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 h-full text-sm">
      <h2 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Market Depth</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Bids */}
        <div>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 text-right">
            <span>Qty.</span>
            <span>Orders</span>
            <span>Bid Price</span>
          </div>
          <div className="space-y-1.5">
            {bids.map((bid) => (
              <MarketDepthRow key={`bid-${bid.price}`} item={bid} type="bid" totalQty={maxQty} />
            ))}
          </div>
        </div>

        {/* Asks */}
        <div>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 text-left">
            <span>Ask Price</span>
            <span>Orders</span>
            <span>Qty.</span>
          </div>
          <div className="space-y-1.5">
            {asks.map((ask) => (
              <MarketDepthRow key={`ask-${ask.price}`} item={ask} type="ask" totalQty={maxQty} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="text-blue-600 dark:text-blue-400">
            <p className="font-semibold">{totalBidQty.toLocaleString()}</p>
            <p>Total Bids</p>
        </div>
        <div className="text-red-600 dark:text-red-400 text-right">
             <p className="font-semibold">{totalAskQty.toLocaleString()}</p>
            <p>Total Asks</p>
        </div>
      </div>
    </div>
  );
};

export default MarketDepth;
