import React, { useState } from 'react';
import { Stock, OrderDetails } from '../types';
import OrderConfirmationModal from './OrderConfirmationModal';

interface OrderModalProps {
  stock: Stock;
  side: 'BUY' | 'SELL';
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ stock, side, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(stock.price);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'SL' | 'SL-M'>('LIMIT');
  const [product, setProduct] = useState<'intraday' | 'longterm' | 'cover'>('longterm');
  const [triggerPrice, setTriggerPrice] = useState(stock.price);
  const [stoplossPrice, setStoplossPrice] = useState(parseFloat((stock.price * 0.99).toFixed(2)));
  const [confirmationDetails, setConfirmationDetails] = useState<OrderDetails | null>(null);

  const isBuy = side === 'BUY';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmationDetails({
      symbol: stock.symbol,
      name: stock.name,
      side,
      quantity,
      price: (orderType === 'MARKET' || orderType === 'SL-M') ? stock.price : price,
      orderType,
      product,
      triggerPrice: (orderType === 'SL' || orderType === 'SL-M') ? triggerPrice : undefined,
      stoplossPrice: product === 'cover' ? stoplossPrice : undefined,
    });
  };

  const handleConfirmOrder = () => {
    if (!confirmationDetails) return;
    alert(`Order placed for ${confirmationDetails.side} ${confirmationDetails.quantity} ${confirmationDetails.symbol} shares.`);
    setConfirmationDetails(null);
    onClose();
  };

  const handleCancelConfirmation = () => {
    setConfirmationDetails(null);
  };

  const handleProductChange = (newProduct: 'intraday' | 'longterm' | 'cover') => {
      setProduct(newProduct);
      if (newProduct === 'cover') {
          setOrderType('MARKET'); // Cover orders are often market orders
      }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
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
            <div className="flex space-x-2">
              <div className="flex items-center">
                <input id="longterm" name="product" type="radio" checked={product === 'longterm'} onChange={() => handleProductChange('longterm')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <label htmlFor="longterm" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Longterm</label>
              </div>
              <div className="flex items-center">
                <input id="intraday" name="product" type="radio" checked={product === 'intraday'} onChange={() => handleProductChange('intraday')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <label htmlFor="intraday" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Intraday</label>
              </div>
              <div className="flex items-center">
                <input id="cover" name="product" type="radio" checked={product === 'cover'} onChange={() => handleProductChange('cover')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <label htmlFor="cover" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Cover</label>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  step="0.05"
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  disabled={orderType === 'MARKET' || orderType === 'SL-M' || product === 'cover'}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-600 text-gray-900 dark:text-gray-200"
                />
              </div>
            </div>

            {(orderType === 'SL' || orderType === 'SL-M') && (
              <div className="w-1/2">
                <label htmlFor="trigger-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trigger Price</label>
                <input
                  type="number"
                  id="trigger-price"
                  value={triggerPrice}
                  step="0.05"
                  onChange={(e) => setTriggerPrice(parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
                />
              </div>
            )}
            
            {product === 'cover' && (
                <div className="w-1/2">
                    <label htmlFor="stoploss-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stoploss</label>
                    <input
                      type="number"
                      id="stoploss-price"
                      value={stoplossPrice}
                      step="0.05"
                      onChange={(e) => setStoplossPrice(parseFloat(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
                      required
                    />
                </div>
            )}
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center">
                    <input id="market" name="orderType" type="radio" checked={orderType === 'MARKET'} onChange={() => setOrderType('MARKET')} disabled={product==='cover'} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50" />
                    <label htmlFor="market" className="ml-2 block text-gray-900 dark:text-gray-300">Market</label>
                </div>
                 <div className="flex items-center">
                    <input id="limit" name="orderType" type="radio" checked={orderType === 'LIMIT'} onChange={() => setOrderType('LIMIT')} disabled={product==='cover'} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50" />
                    <label htmlFor="limit" className="ml-2 block text-gray-900 dark:text-gray-300">Limit</label>
                </div>
                <div className="flex items-center">
                    <input id="sl" name="orderType" type="radio" checked={orderType === 'SL'} onChange={() => setOrderType('SL')} disabled={product==='cover'} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50" />
                    <label htmlFor="sl" className="ml-2 block text-gray-900 dark:text-gray-300">SL</label>
                </div>
                <div className="flex items-center">
                    <input id="sl-m" name="orderType" type="radio" checked={orderType === 'SL-M'} onChange={() => setOrderType('SL-M')} disabled={product==='cover'} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50" />
                    <label htmlFor="sl-m" className="ml-2 block text-gray-900 dark:text-gray-300">SL-M</label>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button type="submit" className={`w-24 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isBuy ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isBuy ? 'focus:ring-blue-500' : 'focus:ring-red-500'}`}>
                {side}
              </button>
              <button type="button" onClick={onClose} className="w-24 py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      {confirmationDetails && (
        <OrderConfirmationModal
          details={confirmationDetails}
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelConfirmation}
        />
      )}
    </>
  );
};

export default OrderModal;
