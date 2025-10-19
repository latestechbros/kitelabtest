import React, { useState } from 'react';
import { useStockData } from '../contexts/StockDataContext';
import { Order } from '../types';

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Executed' | 'Open'>('Executed');
  const { orders, setOrders } = useStockData();

  const executedOrders = orders.filter(o => o.status !== 'PENDING');
  const openOrders = orders.filter(o => o.status === 'PENDING');

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      // In a real app, this would be an API call. Here, we just filter the state.
      setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
    }
  };
  
  const handleModifyOrder = (order: Order) => {
    alert(`Modification for order ${order.id} is not implemented in this demo.`);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'COMPLETE':
        return 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'REJECTED':
        return 'text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const TabButton: React.FC<{ label: 'Executed' | 'Open' }> = ({ label }) => (
    <button
      onClick={() => setActiveTab(label)}
      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
        activeTab === label
          ? 'text-blue-600 border-blue-600'
          : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200'
      }`}
    >
      {label} {label === 'Open' ? `(${openOrders.length})` : ''}
    </button>
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Orders</h1>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
            <TabButton label="Executed" />
            <TabButton label="Open" />
        </div>

        {activeTab === 'Executed' && (
           <div className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
             <div className="grid grid-cols-7 gap-4 p-3 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
                <div>Time</div>
                <div className="col-span-2">Instrument</div>
                <div>Side</div>
                <div>Qty.</div>
                <div>Avg. price</div>
                <div>Status</div>
              </div>
            {executedOrders.map((order: Order) => (
              <div key={order.id} className="grid grid-cols-7 gap-4 p-3 items-center">
                <div>{order.time}</div>
                <div className="col-span-2 font-medium">{order.symbol}</div>
                <div className={`font-semibold ${order.side === 'BUY' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{order.side}</div>
                <div>{order.qty}</div>
                <div>{order.avgPrice.toFixed(2)}</div>
                <div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
             {executedOrders.length === 0 && <p className="p-4 text-center text-gray-500">No executed orders.</p>}
          </div>
        )}

        {activeTab === 'Open' && (
           <div className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
             <div className="grid grid-cols-7 gap-4 p-3 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
                <div>Time</div>
                <div className="col-span-2">Instrument</div>
                <div>Side</div>
                <div>Qty.</div>
                <div>Price</div>
                <div className="text-center">Actions</div>
              </div>
            {openOrders.map((order: Order) => (
              <div key={order.id} className="grid grid-cols-7 gap-4 p-3 items-center">
                <div>{order.time}</div>
                <div className="col-span-2 font-medium">{order.symbol}</div>
                <div className={`font-semibold ${order.side === 'BUY' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{order.side}</div>
                <div>{order.qty}</div>
                <div>{order.avgPrice.toFixed(2)}</div>
                <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => handleModifyOrder(order)} className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/50">Modify</button>
                    <button onClick={() => handleCancelOrder(order.id)} className="px-3 py-1 text-xs font-medium text-red-600 border border-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/50">Cancel</button>
                </div>
              </div>
            ))}
            {openOrders.length === 0 && <p className="p-4 text-center text-gray-500">No open orders.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
