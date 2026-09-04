import React from 'react';
import { useQueue } from '../../context/QueueContext';

export const QueueMetrics: React.FC = () => {
  const { stats, bookings } = useQueue();

  const totalMspPayout = bookings.reduce((sum, b) => sum + (b.total_payout || 0), 0);

  const metrics = [
    {
      label: "Today's Bookings",
      value: stats.totalBookingsToday,
      sub: "Total scheduled today"
    },
    {
      label: "Waiting in Yard",
      value: stats.waitingCount,
      sub: "Awaiting gate/lab call"
    },
    {
      label: "Quality Check",
      value: stats.verifiedCount,
      sub: "Moisture & grading passed"
    },
    {
      label: "Paid & Dispatched",
      value: stats.paidCount,
      sub: "DBT sanctioned"
    },
    {
      label: "Total Procured",
      value: `${stats.totalQuintals} Qtl`,
      sub: `₹${(totalMspPayout / 100000).toFixed(1)}L MSP value`
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between"
        >
          <span className="text-xs font-medium text-slate-500">
            {metric.label}
          </span>
          <div className="mt-2">
            <span className="text-xl font-semibold text-slate-900 font-mono-num tracking-tight block">
              {metric.value}
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              {metric.sub}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
