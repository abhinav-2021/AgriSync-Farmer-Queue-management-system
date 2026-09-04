import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { MOCK_7DAY_PROCUREMENT } from '../../lib/mockData';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: typeof MOCK_7DAY_PROCUREMENT[0] }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-md text-xs shadow-lg border border-slate-800 font-sans">
        <p className="font-semibold text-slate-200">{data.day}, {data.date}</p>
        <p className="font-mono text-emerald-400 font-bold text-sm mt-0.5">
          {data.volumeK},000 Quintals
        </p>
        <div className="mt-1 pt-1 border-t border-slate-700 text-[10px] text-slate-300 space-y-0.5">
          <p>MSP Value: ₹{data.payoutCr} Crores</p>
          <p className="text-slate-400">Wheat: {data.wheatK}k • Paddy: {data.paddyK}k • Mustard: {data.mustardK}k</p>
        </div>
      </div>
    );
  }
  return null;
};

export const ProcurementTrendChart: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between h-full">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Daily Procurement Volume (Last 7 Days)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total tonnage accepted across all 142 mandis ('000 Quintals)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700"></span>
            Total Procured (k Qtl)
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-slate-700 font-semibold">
            Avg: 182k Qtl/day
          </span>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_7DAY_PROCUREMENT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              tickFormatter={(v) => `${v}k`}
              domain={[0, 250]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar
              dataKey="volumeK"
              fill="#15803d"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Footnote */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <span>7-Day Aggregated Volume: <strong className="font-mono text-slate-700 font-semibold">1,276,000 Quintals</strong></span>
        <span>Peak Day: <strong className="text-slate-700 font-semibold">Saturday (215k Qtl)</strong></span>
      </div>

    </div>
  );
};
