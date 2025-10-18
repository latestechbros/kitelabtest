import React from 'react';
import { MOCK_FUND_DETAILS } from '../constants';

const Funds: React.FC = () => {
  const { equity, commodity } = MOCK_FUND_DETAILS;

  const FundRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="flex justify-between py-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800">{value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
  );

  const FundSection: React.FC<{ title: string; data: typeof equity }> = ({ title, data }) => (
    <div className="w-full md:w-1/2">
      <h2 className="text-lg font-semibold text-gray-500 mb-2">{title}</h2>
      <div className="divide-y divide-gray-200">
        <FundRow label="Opening balance" value={data.openingBalance} />
        <FundRow label="Payin" value={data.payin} />
        <FundRow label="Payout" value={data.payout} />
        <FundRow label="SPAN" value={data.span} />
        <FundRow label="Delivery margin" value={data.deliveryMargin} />
        <FundRow label="Exposure" value={data.exposure} />
        <FundRow label="Options premium" value={data.optionsPremium} />
        <div className="flex justify-between py-3 font-semibold">
            <span className="text-gray-500">Total margin</span>
            <span className="text-gray-800">{data.totalMargin.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between py-3 font-semibold text-lg">
            <span className="text-gray-500">Available margin</span>
            <span className="text-gray-800">{data.availableMargin.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Funds</h1>
        <div className="space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Add funds
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Withdraw
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-6">
        <div className="flex flex-col md:flex-row md:space-x-12">
          <FundSection title="Equity" data={equity} />
          <FundSection title="Commodity" data={commodity} />
        </div>
      </div>
    </div>
  );
};

export default Funds;
