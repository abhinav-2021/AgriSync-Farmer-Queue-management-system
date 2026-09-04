import React from 'react';

export const AnalyticsView: React.FC = () => {
  const cropDistribution = [
    { name: 'Wheat (गेहूं)', percentage: 58, volume: '696k Qtl', msp: '₹1.58B' },
    { name: 'Paddy (धान)', percentage: 24, volume: '288k Qtl', msp: '₹628M' },
    { name: 'Mustard (सरसों)', percentage: 12, volume: '144k Qtl', msp: '₹813M' },
    { name: 'Cotton (कपास)', percentage: 6, volume: '72k Qtl', msp: '₹476M' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Procurement & Financial Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Crop distribution, moisture quality breakdown, and DBT payment velocity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Crop Breakdown */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <h3 className="font-semibold text-xs text-slate-900 mb-3">Crop Distribution (Total 1.2M Qtl)</h3>
          <div className="space-y-3">
            {cropDistribution.map((crop) => (
              <div key={crop.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800">{crop.name}</span>
                  <span className="font-mono text-slate-500">{crop.volume} ({crop.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full"
                    style={{ width: `${crop.percentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 text-right">
                  MSP Disbursed: <strong className="font-mono text-slate-700">{crop.msp}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Lab & DBT Metrics */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <h3 className="font-semibold text-xs text-slate-900 mb-3">Quality & Direct Bank Transfer (DBT)</h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
              <span className="text-[11px] text-slate-400 block">Avg Quality Pass Rate</span>
              <span className="font-mono text-xl font-bold text-slate-900 block mt-1">98.8%</span>
              <span className="text-[10px] text-emerald-700">Standard moisture &lt;12%</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
              <span className="text-[11px] text-slate-400 block">DBT Payout Speed</span>
              <span className="font-mono text-xl font-bold text-slate-900 block mt-1">2.4 Hrs</span>
              <span className="text-[10px] text-emerald-700">From Weighbridge to Bank</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
              <span className="text-[11px] text-slate-400 block">Total Transactions</span>
              <span className="font-mono text-xl font-bold text-slate-900 block mt-1">45,210</span>
              <span className="text-[10px] text-slate-500">100% Aadhaar Linked</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
              <span className="text-[11px] text-slate-400 block">State Budget Utilized</span>
              <span className="font-mono text-xl font-bold text-slate-900 block mt-1">70.0%</span>
              <span className="text-[10px] text-slate-500">₹2.1B / ₹3.0B Allocated</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
            <span>Audit report certified by Haryana Food & Supplies Dept.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
