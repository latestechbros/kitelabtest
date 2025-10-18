import React from 'react';
import { HistoricalDataPoint } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface StockChartProps {
  data: HistoricalDataPoint[];
  isPositive: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ data, isPositive }) => {
  const { theme } = useTheme();
  
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No chart data available.</div>;
  }

  const width = 500;
  const height = 200;
  const padding = 20;

  const prices = data.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const getX = (index: number) => {
    return (index / (data.length - 1)) * (width - padding * 2) + padding;
  };

  const getY = (price: number) => {
    if (maxPrice === minPrice) return height / 2;
    return height - ((price - minPrice) / (maxPrice - minPrice)) * (height - padding * 2) - padding;
  };

  const path = data.map((point, i) => {
      const x = getX(i);
      const y = getY(point.price);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

  const chartColor = isPositive ? '#16a34a' : '#dc2626';
  const gridColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-labelledby="stock-chart-title" role="img">
      <title id="stock-chart-title">Stock Price History</title>
      
      {/* Y-axis grid lines */}
      {[...Array(5)].map((_, i) => (
        <line
          key={i}
          x1={padding}
          y1={(height - padding * 2) / 4 * i + padding}
          x2={width - padding}
          y2={(height - padding * 2) / 4 * i + padding}
          stroke={gridColor}
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />
      ))}

      {/* Price Path */}
      <path d={path} stroke={chartColor} strokeWidth="2" fill="none" />

      {/* Gradient under the path */}
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
          <stop offset="100%" stopColor={chartColor} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path d={`${path} L ${getX(data.length - 1)},${height-padding} L ${getX(0)},${height-padding} Z`} fill="url(#chartGradient)" />

    </svg>
  );
};

export default StockChart;
