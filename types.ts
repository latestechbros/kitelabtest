export type View = 'Dashboard' | 'Orders' | 'Holdings' | 'Positions' | 'Funds' | 'Apps' | 'Market';

export interface HistoricalDataPoint {
  date: string;
  price: number;
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
