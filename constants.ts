import { Stock, Index, Holding, Position, Order, FundDetails, HistoricalDataPoint, MarketDepthItem, GTTOrder, WatchlistData } from './types';

export const MOCK_INDICES: Index[] = [
  { symbol: 'NIFTY 50', name: 'NIFTY 50', price: 23501.10, change: 183.45, changePercent: 0.78, prevClose: 23317.65 },
  { symbol: 'NIFTY BANK', name: 'NIFTY BANK', price: 51661.45, change: -121.80, changePercent: -0.24, prevClose: 51783.25 },
  { symbol: 'SENSEX', name: 'SENSEX', price: 77209.90, change: 620.73, changePercent: 0.81, prevClose: 76589.17 },
];

const generateMockHistory = (basePrice: number, points: number = 365): HistoricalDataPoint[] => {
  const history: HistoricalDataPoint[] = [];
  let price = basePrice * (1 - (Math.random() * 0.2 - 0.1)); // Start from a point in the past
  for (let i = 0; i < points; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (points - i));
    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
    const volatility = 0.02;
    price *= (1 + (Math.random() - 0.49) * volatility);
  }
  history[history.length - 1].price = basePrice;
  return history;
};

const generateMockMarketDepth = (basePrice: number): { bids: MarketDepthItem[], asks: MarketDepthItem[] } => {
    const bids: MarketDepthItem[] = [];
    const asks: MarketDepthItem[] = [];
    const tick = 0.05;
    for (let i = 1; i <= 5; i++) {
        bids.push({
            price: parseFloat((basePrice - tick * i * (1 + Math.random() * 0.1)).toFixed(2)),
            orders: Math.floor(Math.random() * 20) + 1,
            qty: Math.floor(Math.random() * 500) + 50
        });
        asks.push({
            price: parseFloat((basePrice + tick * i * (1 + Math.random() * 0.1)).toFixed(2)),
            orders: Math.floor(Math.random() * 20) + 1,
            qty: Math.floor(Math.random() * 500) + 50
        });
    }
    return { bids, asks };
};

const MOCK_WATCHLIST_STOCKS: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2959.00, change: 50.45, changePercent: 1.73, prevClose: 2908.55 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3816.00, change: -21.55, changePercent: -0.56, prevClose: 3837.55 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1663.05, change: 6.85, changePercent: 0.41, prevClose: 1656.20 },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1533.75, change: 12.30, changePercent: 0.81, prevClose: 1521.45 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1119.55, change: -3.85, changePercent: -0.34, prevClose: 1123.40 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1416.70, change: 14.95, changePercent: 1.07, prevClose: 1401.75 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 843.50, change: 10.30, changePercent: 1.23, prevClose: 833.20 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1774.20, change: -1.05, changePercent: -0.06, prevClose: 1775.25 },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', price: 490.85, change: 1.60, changePercent: 0.33, prevClose: 489.25 },
];

export const MOCK_WATCHLISTS: WatchlistData = {
    "My Watchlist": MOCK_WATCHLIST_STOCKS.map(s => s.symbol),
    "Nifty 50": ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN'],
    "IT Sector": ['TCS', 'INFY', 'WIPRO'],
    "Banking": ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK'],
};

export const MOCK_ALL_STOCKS: Stock[] = [
  ...MOCK_WATCHLIST_STOCKS,
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 975.30, change: -5.15, changePercent: -0.53, volume: 15700000, open: 980.00, high: 982.50, low: 971.00, prevClose: 980.45 },
  { symbol: 'ITC', name: 'ITC Ltd.', price: 423.50, change: -2.10, changePercent: -0.49, volume: 12300000, open: 425.00, high: 426.50, low: 422.00, prevClose: 425.60 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2540.80, change: 15.20, changePercent: 0.60, volume: 1800000, open: 2525.00, high: 2550.00, low: 2520.10, prevClose: 2525.60 },
  { symbol: 'LT', name: 'Larsen & Toubro', price: 3590.10, change: 30.50, changePercent: 0.86, volume: 950000, open: 3560.00, high: 3600.00, low: 3555.50, prevClose: 3559.60 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: 1225.40, change: 11.80, changePercent: 0.97, volume: 7500000, open: 1215.00, high: 1230.00, low: 1212.00, prevClose: 1213.60 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 7120.00, change: -80.25, changePercent: -1.11, volume: 800000, open: 7200.00, high: 7210.00, low: 7105.00, prevClose: 7200.25 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: 12850.50, change: 150.75, changePercent: 1.19, volume: 450000, open: 12700.00, high: 12900.00, low: 12680.00, prevClose: 12699.75 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', price: 2880.00, change: 5.40, changePercent: 0.19, volume: 1100000, open: 2875.00, high: 2895.00, low: 2870.00, prevClose: 2874.60 },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', price: 3410.20, change: -25.80, changePercent: -0.75, volume: 1300000, open: 3435.00, high: 3440.00, low: 3405.00, prevClose: 3436.00 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', price: 10850.00, change: 120.00, changePercent: 1.12, volume: 350000, open: 10730.00, high: 10900.00, low: 10710.00, prevClose: 10730.00 },
].map(stock => ({ 
    ...stock, 
    history: generateMockHistory(stock.price),
    ...generateMockMarketDepth(stock.price)
}));


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

export const MOCK_GTT_ORDERS: GTTOrder[] = [
    { id: 'gtt001', symbol: 'HDFCBANK', side: 'BUY', qty: 10, price: 1600.00, triggerPrice: 1605.00, status: 'ACTIVE', createdAt: '2024-07-15' },
    { id: 'gtt002', symbol: 'BHARTIARTL', side: 'SELL', qty: 20, price: 1450.00, triggerPrice: 1445.00, status: 'ACTIVE', createdAt: '2024-07-18' },
];

export const MOCK_FUND_DETAILS: FundDetails = {
    equity: {
        openingBalance: 150000.00,
        payin: 25000.00,
        payout: 0.00,
        span: 35000.00,
        deliveryMargin: 12000.00,
        exposure: 8000.00,
        optionsPremium: 5000.00,
        totalMargin: 60000.00,
        availableMargin: 115000.00
    },
    commodity: {
        openingBalance: 50000.00,
        payin: 0.00,
        payout: 10000.00,
        span: 15000.00,
        deliveryMargin: 0.00,
        exposure: 2000.00,
        optionsPremium: 1000.00,
        totalMargin: 18000.00,
        availableMargin: 22000.00
    }
};
