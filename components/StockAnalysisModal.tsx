import React, { useState, useEffect } from 'react';
import { Stock } from '../types';
import { analyzeStock } from '../services/geminiService';

interface StockAnalysisModalProps {
  stock: Stock;
  onClose: () => void;
}

const StockAnalysisModal: React.FC<StockAnalysisModalProps> = ({ stock, onClose }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await analyzeStock(stock);
        setAnalysis(result);
      } catch (err) {
        setError('Failed to fetch analysis. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [stock]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          AI Analysis: {stock.name} ({stock.symbol})
        </h2>
        <div className="mt-4 text-gray-600 dark:text-gray-300 prose max-w-none dark:prose-invert">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Analyzing, please wait...</p>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && (
             <div
                className="prose-sm"
                dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StockAnalysisModal;
