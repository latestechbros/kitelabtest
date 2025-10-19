import React, { useState, useMemo, useEffect } from 'react';
import { HistoricalDataPoint } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface StockChartProps {
  data: HistoricalDataPoint[];
  isPositive: boolean;
}

// --- Calculation Helpers ---
const calculateMA = (data: HistoricalDataPoint[], period: number): (HistoricalDataPoint | null)[] => {
  if (data.length < period) return [];
  const result: (HistoricalDataPoint | null)[] = Array(period - 1).fill(null);
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.price, 0);
    result.push({
        date: data[i].date,
        price: sum / period,
    });
  }
  return result;
};

const calculateRSI = (data: HistoricalDataPoint[], period: number = 14): (HistoricalDataPoint | null)[] => {
    if (data.length <= period) return [];

    const rsiData: (HistoricalDataPoint | null)[] = Array(period).fill(null);
    const changes = data.map((p, i) => i > 0 ? p.price - data[i - 1].price : 0).slice(1);
    
    let gain = 0;
    let loss = 0;

    for (let i = 0; i < period; i++) {
        if (changes[i] > 0) gain += changes[i];
        else loss -= changes[i];
    }

    let avgGain = gain / period;
    let avgLoss = loss / period;
    
    const calculateRSIValue = (avgG: number, avgL: number) => {
        if (avgL === 0) return 100;
        const rs = avgG / avgL;
        return 100 - (100 / (1 + rs));
    };
    
    rsiData.push({ date: data[period].date, price: calculateRSIValue(avgGain, avgLoss) });

    for (let i = period; i < changes.length; i++) {
        const currentChange = changes[i];
        const currentGain = currentChange > 0 ? currentChange : 0;
        const currentLoss = currentChange < 0 ? -currentChange : 0;
        avgGain = (avgGain * (period - 1) + currentGain) / period;
        avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
        rsiData.push({ date: data[i + 1].date, price: calculateRSIValue(avgGain, avgLoss) });
    }

    return rsiData;
};


const StockChart: React.FC<StockChartProps> = ({ data, isPositive }) => {
  const { theme } = useTheme();
  const [showIndicators, setShowIndicators] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; point: HistoricalDataPoint, rsi?: number | null, ma?: number | null } | null>(null);
  const [indicators, setIndicators] = useState({ ma10: false, rsi14: false });

  const [visibleRange, setVisibleRange] = useState({ start: 0, end: data.length });

  useEffect(() => {
    setVisibleRange({ start: 0, end: data.length });
  }, [data]);

  const visibleData = useMemo(() => data.slice(visibleRange.start, visibleRange.end), [data, visibleRange]);
  
  const ma10Data = useMemo(() => indicators.ma10 ? calculateMA(visibleData, 10) : [], [visibleData, indicators.ma10]);
  const rsi14Data = useMemo(() => indicators.rsi14 ? calculateRSI(data, 14).slice(visibleRange.start, visibleRange.end) : [], [data, visibleRange, indicators.rsi14]);


  if (!data || data.length < 2) {
    return <div className="h-64 flex items-center justify-center text-gray-500">Not enough data to display chart.</div>;
  }

  const width = 500;
  const priceChartHeight = 200;
  const rsiChartHeight = 80;
  const chartGap = 30;
  const height = indicators.rsi14 ? priceChartHeight + rsiChartHeight + chartGap : priceChartHeight;
  const padding = 20;

  // Price chart scaling
  const prices = visibleData.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const getX = (index: number) => (index / (visibleData.length - 1)) * (width - padding * 2) + padding;
  const getY = (price: number) => height - ((price - minPrice) / (maxPrice - minPrice)) * (priceChartHeight - padding * 2) - padding - (indicators.rsi14 ? rsiChartHeight + chartGap : 0);

  // RSI chart scaling
  const getRSIY = (rsi: number) => rsiChartHeight - (rsi / 100) * (rsiChartHeight - 10) - 5;

  const path = visibleData.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(point.price)}`).join(' ');
  const maPath = ma10Data.map((point, i) => point ? `${i === 0 || !ma10Data[i-1] ? 'M' : 'L'} ${getX(i + 9)},${getY(point.price)}` : '').join(' ');
  const rsiPath = rsi14Data.map((point, i) => point ? `${i === 0 || !rsi14Data[i-1] ? 'M' : 'L'} ${getX(i)},${getRSIY(point.price)}` : '').join(' ');

  const chartColor = isPositive ? '#16a34a' : '#dc2626';
  const gridColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    if (cursorPt.x < padding || cursorPt.x > width - padding || cursorPt.y < 0 || cursorPt.y > priceChartHeight) {
      if (tooltip) setTooltip(null);
      return;
    }

    const index = Math.min(visibleData.length - 1, Math.max(0, 
        Math.round(((cursorPt.x - padding) / (width - padding * 2)) * (visibleData.length - 1))
    ));

    const point = visibleData[index];
    if (point) {
        const x = getX(index);
        const y = getY(point.price);
        const maValue = ma10Data.find(p => p?.date === point.date);
        const rsiValue = rsi14Data.find(p => p?.date === point.date);
        setTooltip({ x, y, point, ma: maValue?.price, rsi: rsiValue?.price });
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const range = visibleRange.end - visibleRange.start;
    const newRange = direction === 'in' ? Math.max(20, Math.floor(range * 0.8)) : Math.min(data.length, Math.ceil(range * 1.2));
    const midPoint = Math.floor(visibleRange.start + range / 2);
    const newStart = Math.max(0, midPoint - Math.floor(newRange / 2));
    const newEnd = Math.min(data.length, newStart + newRange);
    setVisibleRange({ start: newStart, end: newEnd });
  };
  
  const handlePan = (direction: 'left' | 'right') => {
      const shift = Math.floor((visibleRange.end - visibleRange.start) * 0.1);
      const move = direction === 'left' ? -shift : shift;
      const newStart = Math.max(0, visibleRange.start + move);
      const newEnd = Math.min(data.length, visibleRange.end + move);
      if (newStart !== visibleRange.start || newEnd !== visibleRange.end) {
          setVisibleRange({ start: newStart, end: newEnd });
      }
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-10 flex space-x-2">
         <div className="flex items-center rounded-md bg-gray-100 dark:bg-gray-900/50 p-0.5">
            <button onClick={() => handlePan('left')} className="px-2 py-0.5 text-lg font-mono text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">&#8592;</button>
            <button onClick={() => handleZoom('in')} className="px-2 py-0.5 text-lg font-mono text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">+</button>
            <button onClick={() => handleZoom('out')} className="px-2 py-0.5 text-lg font-mono text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">-</button>
            <button onClick={() => handlePan('right')} className="px-2 py-0.5 text-lg font-mono text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">&#8594;</button>
         </div>
        <div className="relative">
          <button
            onClick={() => setShowIndicators(prev => !prev)}
            className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Indicators
          </button>
          {showIndicators && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-20">
                <label className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <input type="checkbox" checked={indicators.ma10} onChange={() => setIndicators(s => ({...s, ma10: !s.ma10}))} className="mr-2"/>
                    Moving Average (10)
                </label>
                <label className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <input type="checkbox" checked={indicators.rsi14} onChange={() => setIndicators(s => ({...s, rsi14: !s.rsi14}))} className="mr-2"/>
                    RSI (14)
                </label>
            </div>
          )}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)} aria-labelledby="stock-chart-title" role="img">
        <title id="stock-chart-title">Stock Price History</title>
        
        {/* Y-axis grid lines for price */}
        {[...Array(5)].map((_, i) => (
          <line key={i} x1={padding} y1={getY(minPrice + (maxPrice-minPrice)/4 * i)} x2={width - padding} y2={getY(minPrice + (maxPrice-minPrice)/4 * i)} stroke={gridColor} strokeWidth="0.5" strokeDasharray="2,2" />
        ))}

        <path d={path} stroke={chartColor} strokeWidth="2" fill="none" />
        <defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={chartColor} stopOpacity={0.4} /><stop offset="100%" stopColor={chartColor} stopOpacity={0.0} /></linearGradient></defs>
        <path d={`${path} L ${getX(visibleData.length - 1)},${getY(minPrice)} L ${getX(0)},${getY(minPrice)} Z`} fill="url(#chartGradient)" />

        {indicators.ma10 && <path d={maPath} stroke="#f59e0b" strokeWidth="1.5" fill="none" />}

        {indicators.rsi14 && (
            <g transform={`translate(0, ${priceChartHeight + chartGap})`}>
                <rect x={padding} y={0} width={width - padding*2} height={rsiChartHeight} fill={theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}/>
                <line x1={padding} y1={getRSIY(70)} x2={width - padding} y2={getRSIY(70)} stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1={padding} y1={getRSIY(30)} x2={width - padding} y2={getRSIY(30)} stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={padding + 5} y={getRSIY(70) - 2} fill="#9ca3af" fontSize="8px">70</text>
                <text x={padding + 5} y={getRSIY(30) + 8} fill="#9ca3af" fontSize="8px">30</text>
                <path d={rsiPath} stroke="#a78bfa" strokeWidth="1.5" fill="none" />
            </g>
        )}
        
        {tooltip && (
          <g style={{ pointerEvents: 'none' }}>
            <line x1={tooltip.x} y1={0} x2={tooltip.x} y2={height - (indicators.rsi14 ? 0 : padding)} stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} strokeWidth="1" strokeDasharray="3,3" />
            <circle cx={tooltip.x} cy={tooltip.y} r="4" fill={chartColor} stroke={theme === 'dark' ? '#1f2937' : '#ffffff'} strokeWidth="2" />
            
            <g transform={`translate(${tooltip.x > width / 2 ? tooltip.x - 135 : tooltip.x + 15}, ${padding})`}>
                <rect x="0" y="0" width="120" height={60 + (tooltip.ma ? 15 : 0) + (tooltip.rsi ? 15 : 0)} fill={theme === 'dark' ? 'rgba(55, 65, 81, 0.9)' : 'rgba(249, 250, 251, 0.9)'} rx="4" ry="4" stroke={gridColor} />
                <text x="5" y="14" fill={theme === 'dark' ? '#D1D5DB' : '#374151'} fontSize="10px">{new Date(tooltip.point.date).toLocaleDateString()}</text>
                <text x="5" y="30" fill={theme === 'dark' ? '#F9FAFB' : '#111827'} fontSize="12px" fontWeight="bold">₹{tooltip.point.price.toFixed(2)}</text>
                {tooltip.ma && <text x="5" y="45" fill="#f59e0b" fontSize="10px">MA(10): {tooltip.ma.toFixed(2)}</text>}
                {tooltip.rsi && <text x="5" y={45 + (tooltip.ma ? 15 : 0)} fill="#a78bfa" fontSize="10px">RSI(14): {tooltip.rsi.toFixed(2)}</text>}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default StockChart;