
import React from 'react';
import { MOCK_ORDERS } from '../constants';
import { Order } from '../types';

const Orders: React.FC = () => {

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'COMPLETE':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Orders</h1>
      <div className="bg-white border border-gray-200 rounded-md">
        <div className="grid grid-cols-7 gap-4 p-3 text-sm text-gray-500 font-medium border-b">
          <div>Time</div>
          <div className="col-span-2">Instrument</div>
          <div>Side</div>
          <div>Qty.</div>
          <div>Avg. price</div>
          <div>Status</div>
        </div>
        <div className="divide-y divide-gray-100 text-sm">
          {MOCK_ORDERS.map((order: Order) => (
            <div key={order.id} className="grid grid-cols-7 gap-4 p-3 items-center">
              <div>{order.time}</div>
              <div className="col-span-2 font-medium">{order.symbol}</div>
              <div className={`font-semibold ${order.side === 'BUY' ? 'text-blue-600' : 'text-red-600'}`}>{order.side}</div>
              <div>{order.qty}</div>
              <div>{order.avgPrice.toFixed(2)}</div>
              <div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
