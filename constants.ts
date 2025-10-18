
import { Stock, Index, Holding, Position, Order } from './types';

export const MOCK_INDICES: Index[] = [
  { symbol: 'NIFTY 50', name: 'NIFTY 50', price: 23501.10, change: 183.45, changePercent: 0.78 },
  { symbol: 'NIFTY BANK', name: 'NIFTY BANK', price: 51661.45, change: -121.80, changePercent: -0.24 },
  { symbol: 'SENSEX', name: 'SENSEX', price: 77209.90, change: 620.73, changePercent: 0.81 },
];

export const MOCK_WATCHLIST: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2959.00, change: 50.45, changePercent: 1.73 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3816.00, change: -21.55, changePercent: -0.56 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1663.05, change: 6.85, changePercent: 0.41 },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1533.75, change: 12.30, changePercent: 0.81 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1119.55, change: -3.85, changePercent: -0.34 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1416.70, change: 14.95, changePercent: 1.07 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 843.50, change: 10.30, changePercent: 1.23 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1774.20, change: -1.05, changePercent: -0.06 },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', price: 490.85, change: 1.60, changePercent: 0.33 },
];


export const MOCK_HOLDINGS: Holding[] = [
  { symbol: 'GOLDBEES', qty: 50, avgPrice: 61.50, ltp: 68.20, currentValue: 3410, pnl: 335, pnlPercent: 10.9, dayChange: 0.5, dayChangePercent: 0.74 },
  { symbol: 'INFY', qty: 10, avgPrice: 1450.75, ltp: 1533.75, currentValue: 15337.5, pnl: 830, pnlPercent: 5.72, dayChange: 12.30, dayChangePercent: 0.81 },
  { symbol: 'ITC', qty: 100, avgPrice: 430.20, ltp: 423.50, currentValue: 42350, pnl: -670, pnlPercent: -1.56, dayChange: -2.10, dayChangePercent: -0.49 },
  { symbol: 'RELIANCE', qty: 5, avgPrice: 2800.00, ltp: 2959.00, currentValue: 14795, pnl: 795, pnlPercent: 5.68, dayChange: 50.45, dayChangePercent: 1.73 },
  { symbol: 'TATAMOTORS', qty: 25, avgPrice: 950.00, ltp: 975.30, currentValue: 24382.5, pnl: 632.5, pnlPercent: 2.66, dayChange: -5.15, dayChangePercent: -0.53 },
];

export const MOCK_POSITIONS: Position[] = [
    { symbol: 'NIFTY24JULFUT', qty: 50, avgPrice: 23550.00, ltp: 23580.50, pnl: 1525, m2m: 1525 },
    { symbol: 'BANKNIFTY24JULFUT', qty: -15, avgPrice: 51700.00, ltp: 51650.10, pnl: 748.5, m2m: 748.5 },
];

export const MOCK_ORDERS: Order[] = [
    { id: '2345679', symbol: 'SBIN', type: 'LIMIT', side: 'BUY', qty: 10, avgPrice: 840.00, status: 'COMPLETE', time: '10:45:12' },
    { id: '2345680', symbol: 'WIPRO', type: 'MARKET', side: 'SELL', qty: 50, avgPrice: 490.85, status: 'COMPLETE', time: '11:20:05' },
    { id: '2345681', symbol: 'RELIANCE', type: 'LIMIT', side: 'BUY', qty: 5, avgPrice: 2950.00, status: 'PENDING', time: '13:15:40' },
    { id: '2345682', symbol: 'TCS', type: 'LIMIT', side: 'BUY', qty: 10, avgPrice: 3800.00, status: 'REJECTED', time: '14:02:33' }
];
