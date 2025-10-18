import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Stock, Index, Holding, Position } from '../types';
import { MOCK_ALL_STOCKS, MOCK_INDICES, MOCK_HOLDINGS, MOCK_POSITIONS } from '../constants';
import { produce } from 'https://esm.sh/immer@10.1.1';

interface StockDataContextType {
  stocks: Stock[];
  indices: Index[];
  holdings: Holding[];
  positions: Position[];
  getStockBySymbol: (symbol: string) => Stock | undefined;
}

const StockDataContext = createContext<StockDataContextType | undefined>(undefined);

export const StockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>(MOCK_ALL_STOCKS);
  const [indices, setIndices] = useState<Index[]>(MOCK_INDICES);
  const [holdings, setHoldings] = useState<Holding[]>(MOCK_HOLDINGS);
  const [positions, setPositions] = useState<Position[]>(MOCK_POSITIONS);

  const stocksRef = useRef(stocks);
  stocksRef.current = stocks;

  useEffect(() => {
    const interval = setInterval(() => {
      // Update a few random stocks
      setStocks(currentStocks => 
        produce(currentStocks, draft => {
          for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * draft.length);
            const stock = draft[randomIndex];
            if (stock && stock.prevClose) {
              const changeFactor = (Math.random() - 0.5) * 0.01; // +/- 0.5%
              const newPrice = stock.price * (1 + changeFactor);
              stock.price = parseFloat(newPrice.toFixed(2));
              stock.change = stock.price - stock.prevClose;
              stock.changePercent = (stock.change / stock.prevClose) * 100;

              // Also update OHLC realistically
              if (stock.low && stock.high) {
                stock.low = Math.min(stock.low, stock.price);
                stock.high = Math.max(stock.high, stock.price);
              }
            }
          }
        })
      );

      // Update a random index
      setIndices(currentIndices =>
        produce(currentIndices, draft => {
           const randomIndex = Math.floor(Math.random() * draft.length);
           const index = draft[randomIndex];
           if (index && index.prevClose) {
              const changeFactor = (Math.random() - 0.5) * 0.005; // +/- 0.25%
              const newPrice = index.price * (1 + changeFactor);
              index.price = parseFloat(newPrice.toFixed(2));
              index.change = index.price - index.prevClose;
              index.changePercent = (index.change / index.prevClose) * 100;
           }
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  
  // Recalculate holdings and positions when stock prices change
  useEffect(() => {
      const stockMap = new Map(stocksRef.current.map(s => [s.symbol, s]));
      
      setHoldings(currentHoldings => 
        produce(currentHoldings, draft => {
          draft.forEach(holding => {
            const latestStock = stockMap.get(holding.symbol);
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
            // This is a simplification; real futures P&L is more complex
            // For this demo, we'll just simulate a small random change
            draft.forEach(pos => {
                pos.ltp *= (1 + (Math.random() - 0.5) * 0.001);
                pos.pnl = (pos.ltp - pos.avgPrice) * pos.qty;
                pos.m2m = pos.pnl; // Simplified M2M
            });
        })
      );

  }, [stocks]);

  const getStockBySymbol = (symbol: string) => {
    return stocks.find(s => s.symbol === symbol);
  };

  return (
    <StockDataContext.Provider value={{ stocks, indices, holdings, positions, getStockBySymbol }}>
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
