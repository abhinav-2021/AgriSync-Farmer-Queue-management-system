import React from 'react';
import { useQueue } from '../../context/QueueContext';
import { ChevronRight } from 'lucide-react';

export const CongestionAlertsCard: React.FC = () => {
  const { mandis, setAdminTab, selectedStateFilter } = useQueue();

  const getStatusBadge = (status: 'critical' | 'warning' | 'optimal') => {
    switch (status) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
            Critical Wait
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Moderate Delay
          </span>
        );
      case 'optimal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Optimal Flow
          </span>
        );
    }
  };

  const getStateBadge = (state: string) => {
    switch (state) {
      case 'Madhya Pradesh':
        return <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">MP</span>;
      case 'Punjab':
        return <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-100">PB</span>;
      case 'Bihar':
        return <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-100">BR</span>;
      case 'Uttar Pradesh':
        return <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-100">UP</span>;
      case 'Haryana':
      default:
        return <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">HR</span>;
    }
  };

  // Filter mandis based on selectedStateFilter
  const baseMandis = selectedStateFilter === 'all'
    ? mandis
    : mandis.filter((m) => m.state === selectedStateFilter);

  // Sort: critical first, then warning, then optimal
  const prioritySorted = [...baseMandis].sort((a, b) => {
    const score = (s: string) => (s === 'critical' ? 3 : s === 'warning' ? 2 : 1);
    return score(b.status) - score(a.status) || b.waitTimeMinutes - a.waitTimeMinutes;
  });

  const displayList = prioritySorted.slice(0, 5);
  const optimalCount = baseMandis.filter((m) => m.status === 'optimal').length;
  const totalCount = baseMandis.length;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between h-full">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                System & Congestion Alerts
              </h2>
              {selectedStateFilter !== 'all' && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {selectedStateFilter}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live yard queue & gate turnaround times
            </p>
          </div>
          <button
            onClick={() => setAdminTab('centres')}
            className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>All Mandis</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="divide-y divide-slate-100">
          {displayList.map((mandi) => (
            <div
              key={mandi.id}
              className="py-2.5 flex items-start justify-between gap-3 hover:bg-slate-50/60 transition-colors rounded-md px-1"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-semibold text-xs text-slate-900 leading-snug">
                    {mandi.name}
                  </h4>
                  {getStateBadge(mandi.state)}
                  <span className="text-[11px] text-slate-400 font-normal">
                    • {mandi.district}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono-num">
                  <span className={mandi.status === 'critical' ? 'text-red-700 font-semibold' : mandi.status === 'warning' ? 'text-amber-700 font-semibold' : 'text-slate-700 font-medium'}>
                    {mandi.waitTimeMinutes} mins wait
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{mandi.activeVehicles} vehicles in yard</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                {getStatusBadge(mandi.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Dynamic load balancing active</span>
        <span className="text-emerald-700 font-medium font-mono">{optimalCount}/{totalCount} Optimal Flow</span>
      </div>

    </div>
  );
};
