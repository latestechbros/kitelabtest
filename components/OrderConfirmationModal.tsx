import React from 'react';
import { OrderDetails } from '../types';

interface OrderConfirmationModalProps {
  details: OrderDetails;
  onConfirm: () => void;
  onCancel: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ details, onConfirm, onCancel }) => {
  const isBuy = details.side === 'BUY';
  const estimatedValue = details.quantity * details.price;

  const getProductText = () => {
      switch (details.product) {
          case 'longterm': return 'Longterm (CNC)';
          case 'intraday': return 'Intraday (MIS)';
          case 'cover': return 'Cover (CO)';
          default: return '';
      }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm animate-fade-in-up">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Confirm Order</h2>
        </div>
        
        <div className="p-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Action</span>
            <span className={`font-semibold ${isBuy ? 'text-blue-600' : 'text-red-600'}`}>{details.side} {details.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Quantity</span>
            <span className="font-semibold">{details.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Order Type</span>
            <span className="font-semibold">{details.orderType}</span>
          </div>
          {(details.orderType === 'LIMIT' || details.orderType === 'SL') && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Price</span>
              <span className="font-semibold">{details.price.toFixed(2)}</span>
            </div>
          )}
          {details.triggerPrice !== undefined && (
             <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Trigger Price</span>
              <span className="font-semibold">{details.triggerPrice.toFixed(2)}</span>
            </div>
          )}
          {details.stoplossPrice !== undefined && (
             <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Stoploss Price</span>
              <span className="font-semibold text-red-500">{details.stoplossPrice.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Product</span>
            <span className="font-semibold">{getProductText()}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          <div className="flex justify-between font-bold">
            <span className="text-gray-500 dark:text-gray-400">Estimated Value</span>
            <span>{estimatedValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isBuy ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}>
            Confirm {details.side}
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmationModal;
