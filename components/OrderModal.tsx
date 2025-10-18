import React, { useState } from 'react';
import { Stock } from '../types';

interface OrderModalProps {
  stock: Stock;
  side: 'BUY' | 'SELL';
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ stock, side, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(stock.price);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('LIMIT');
  const [product, setProduct] = useState<' intraday' | 'longterm'>('longterm');

  const isBuy = side === 'BUY';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      symbol: stock.symbol,
      side,
      quantity,
      price: orderType === 'MARKET' ? 0 : price,
      orderType,
      product,
    });
    // In a real app, you would dispatch an action to place the order
    alert(`Order placed for ${side} ${quantity} ${stock.symbol} shares.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className={`p-4 rounded-t-lg ${isBuy ? 'bg-blue-600' : 'bg-red-600'}`}>
          <div className="flex justify-between items-center text-white">
            <h2 className="text-lg font-bold">
              {side} {stock.symbol}
            </h2>
            <button onClick={onClose} className="text-white hover:opacity-75">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-white opacity-90">{stock.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                disabled={orderType === 'MARKET'}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input id="limit" name="orderType" type="radio" checked={orderType === 'LIMIT'} onChange={() => setOrderType('LIMIT')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <label htmlFor="limit" className="ml-2 block text-sm text-gray-900">LIMIT</label>
            </div>
            <div className="flex items-center">
              <input id="market" name="orderType" type="radio" checked={orderType === 'MARKET'} onChange={() => setOrderType('MARKET')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <label htmlFor="market" className="ml-2 block text-sm text-gray-900">MARKET</label>
            </div>
          </div>

          {/* This is a simplified product toggle, more logic would be needed for SL, SL-M etc. */}
           <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input id="longterm" name="product" type="radio" checked={product === 'longterm'} onChange={() => setProduct('longterm')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <label htmlFor="longterm" className="ml-2 block text-sm text-gray-900">Longterm (CNC)</label>
            </div>
            <div className="flex items-center">
              <input id="intraday" name="product" type="radio" checked={product === 'intraday'} onChange={() => setProduct('intraday')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <label htmlFor="intraday" className="ml-2 block text-sm text-gray-900">Intraday (MIS)</label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button type="submit" className={`w-24 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isBuy ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isBuy ? 'focus:ring-blue-500' : 'focus:ring-red-500'}`}>
              {side}
            </button>
            <button type="button" onClick={onClose} className="w-24 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
