export type View = 'Dashboard' | 'Orders' | 'Holdings' | 'Positions' | 'Funds' | 'Apps' | 'Market';

export interface HistoricalDataPoint {
  date: string;
  price: number;
}

export interface MarketDepthItem {
    price: number;
    orders: number;
    qty: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  history?: HistoricalDataPoint[];
  bids?: MarketDepthItem[];
  asks?: MarketDepthItem[];
}

export interface Index extends Stock {}

export interface Holding {
  symbol: string;
  qty: number;
  avgPrice: number;
  ltp: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface Position {
    symbol: string;
    qty: number;
    avgPrice: number;
    ltp: number;
    pnl: number;
    m2m: number;
}

export interface Order {
    id: string;
    symbol: string;
    type: 'MARKET' | 'LIMIT';
    side: 'BUY' | 'SELL';
    qty: number;
    avgPrice: number;
    status: 'COMPLETE' | 'PENDING' | 'REJECTED';
    time: string;
}

export interface GTTOrder {
  id: string;
  symbol: string;
  triggerPrice: number;
  price: number;
  qty: number;
  side: 'BUY' | 'SELL';
  status: 'ACTIVE' | 'TRIGGERED';
  createdAt: string;
}


export interface FundDetails {
    equity: {
        openingBalance: number;
        payin: number;
        payout: number;
        span: number;
        deliveryMargin: number;
        exposure: number;
        optionsPremium: number;
        totalMargin: number;
        availableMargin: number;
    },
    commodity: {
        openingBalance: number;
        payin: number;
        payout: number;
        span: number;
        deliveryMargin: number;
        exposure: number;
        optionsPremium: number;
        totalMargin: number;
        availableMargin: number;
    }
}

export interface OrderDetails {
  symbol: string;
  name: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  orderType: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';
  product: 'intraday' | 'longterm' | 'cover';
  triggerPrice?: number;
  stoplossPrice?: number;
}

export interface WatchlistData {
    [key: string]: string[]; // Watchlist name -> array of symbols
}
