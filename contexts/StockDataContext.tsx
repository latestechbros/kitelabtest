import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Stock, Index, Holding, Position, Order, GTTOrder } from '../types';
import { MOCK_ALL_STOCKS, MOCK_INDICES, MOCK_HOLDINGS, MOCK_POSITIONS, MOCK_ORDERS, MOCK_GTT_ORDERS } from '../constants';
import { produce } from 'https://esm.sh/immer@10.1.1';

interface StockDataContextType {
  stocks: Stock[];
  indices: Index[];
  holdings: Holding[];
  positions: Position[];
  orders: Order[];
  gttOrders: GTTOrder[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setGttOrders: React.Dispatch<React.SetStateAction<GTTOrder[]>>;
  getStockBySymbol: (symbol: string) => Stock | undefined;
}

const StockDataContext = createContext<StockDataContextType | undefined>(undefined);

export const StockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>(MOCK_ALL_STOCKS);
  const [indices, setIndices] = useState<Index[]>(MOCK_INDICES);
  const [holdings, setHoldings] = useState<Holding[]>(MOCK_HOLDINGS);
  const [positions, setPositions] = useState<Position[]>(MOCK_POSITIONS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [gttOrders, setGttOrders] = useState<GTTOrder[]>(MOCK_GTT_ORDERS);

  const stocksRef = useRef(stocks);
  stocksRef.current = stocks;

  useEffect(() => {
    const interval = setInterval(() => {
      // Update stocks with a certain probability to make it look more lively
      setStocks(currentStocks => 
        produce(currentStocks, draft => {
          draft.forEach(stock => {
            if (stock && stock.prevClose && Math.random() < 0.3) { // 30% chance to update each second
              const changeFactor = (Math.random() - 0.5) * 0.01; // +/- 0.5%
              const newPrice = stock.price * (1 + changeFactor);
              stock.price = parseFloat(newPrice.toFixed(2));
              stock.change = stock.price - stock.prevClose;
              stock.changePercent = (stock.change / stock.prevClose) * 100;

              if (stock.low && stock.high) {
                stock.low = Math.min(stock.low, stock.price);
                stock.high = Math.max(stock.high, stock.price);
              }
              
              // Simulate market depth changes
              stock.bids?.forEach(bid => {
                  bid.qty = Math.max(10, bid.qty + Math.floor((Math.random() - 0.5) * 50));
              });
              stock.asks?.forEach(ask => {
                  ask.qty = Math.max(10, ask.qty + Math.floor((Math.random() - 0.5) * 50));
              });
            }
          });
        })
      );

      // Update all indices every tick
      setIndices(currentIndices =>
        produce(currentIndices, draft => {
           draft.forEach(index => {
             if (index && index.prevClose) {
                const changeFactor = (Math.random() - 0.5) * 0.005; // +/- 0.25%
                const newPrice = index.price * (1 + changeFactor);
                index.price = parseFloat(newPrice.toFixed(2));
                index.change = index.price - index.prevClose;
                index.changePercent = (index.change / index.prevClose) * 100;
             }
           });
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  // Recalculate holdings and positions when stock/index prices change
  useEffect(() => {
      // FIX: Explicitly type maps to help TypeScript correctly infer the types.
      // This prevents errors where properties are accessed on an 'unknown' type.
      const stockMap: Map<string, Stock> = new Map(stocks.map(s => [s.symbol, s]));
      const indexMap: Map<string, Index> = new Map(indices.map(i => [i.symbol, i]));

      setHoldings(currentHoldings => 
        produce(currentHoldings, draft => {
          draft.forEach(holding => {
            const latestStock = stockMap.get(holding.symbol) as Stock | undefined;
            if (latestStock) {
              holding.ltp = latestStock.price;
              holding.currentValue = holding.qty * holding.ltp;
              holding.pnl = holding.currentValue - (holding.qty * holding.avgPrice);
              holding.pnlPercent = (holding.pnl / (holding.qty * holding.avgPrice)) * 100;
              holding.dayChange = latestStock.change;
              holding.dayChangePercent = latestStock.changePercent;
            }
          });
        })
      );

      setPositions(currentPositions =>
        produce(currentPositions, draft => {
            const nifty = indexMap.get('NIFTY 50');
            const bankNifty = indexMap.get('NIFTY BANK');
            
            draft.forEach(pos => {
                let basis = 0;
                let indexPrice = 0;
                let indexPrevClose = 0;

                if (pos.symbol.includes('NIFTY') && !pos.symbol.includes('BANKNIFTY') && nifty?.prevClose) {
                    indexPrice = nifty.price;
                    indexPrevClose = nifty.prevClose;
                } else if (pos.symbol.includes('BANKNIFTY') && bankNifty?.prevClose) {
                    indexPrice = bankNifty.price;
                    indexPrevClose = bankNifty.prevClose;
                }

                if (indexPrice && indexPrevClose) {
                    // basis is the premium/discount of the future over the spot price, which we assume is constant for this simulation
                    basis = pos.avgPrice - indexPrevClose;
                    const newLtp = indexPrice + basis + (Math.random() - 0.5) * 5; // Add some random noise to simulate market fluctuations
                    pos.ltp = parseFloat(newLtp.toFixed(2));
                } else {
                    // Fallback to a random walk if the underlying index isn't found
                    pos.ltp *= (1 + (Math.random() - 0.5) * 0.001);
                }
                
                pos.pnl = (pos.ltp - pos.avgPrice) * pos.qty;
                pos.m2m = pos.pnl; // Simplified M2M for demo
            });
        })
      );

  }, [stocks, indices]);

  const getStockBySymbol = (symbol: string) => {
    return stocks.find(s => s.symbol === symbol);
  };

  return (
    <StockDataContext.Provider value={{ stocks, indices, holdings, positions, orders, gttOrders, setOrders, setGttOrders, getStockBySymbol }}>
      {children}
    </StockDataContext.Provider>
  );
};

export const useStockData = () => {
  const context = useContext(StockDataContext);
  if (context === undefined) {
    throw new Error('useStockData must be used within a StockDataProvider');
  }
  return context;
};
