
export type View = 'Dashboard' | 'Orders' | 'Holdings' | 'Positions' | 'Funds' | 'Apps';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
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
