import React from 'react';
import { useQueue } from '../../context/QueueContext';

export const CallNextControl: React.FC = () => {
  const {
    activeCalledToken,
    callNextToken,
    activeCounter,
    setActiveCounter,
    bookings
  } = useQueue();

  const calledBooking = bookings.find((b) => b.token_number === activeCalledToken);

  const handleCallNext = () => {
    callNextToken(undefined, activeCounter);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Active Serving Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          
          {/* Active Token Pill */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Serving
            </span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 bg-amber-50 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-md">
              #{activeCalledToken || '---'}
            </div>
          </div>

          {/* Farmer & Station Meta */}
          {calledBooking ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 border-l-0 sm:border-l border-slate-200 sm:pl-6">
              <div>
                <span className="font-semibold text-slate-900 text-sm">{calledBooking.farmer_name}</span>
                <span className="text-slate-400 ml-1.5 font-mono">{calledBooking.vehicle_number}</span>
              </div>
              <div className="hidden lg:inline text-slate-300">•</div>
              <div className="text-slate-600">
                <span>{calledBooking.crop_type}</span>
                <span className="text-slate-400 ml-1">({calledBooking.actual_weight_quintals || calledBooking.estimated_quintals} Qtl)</span>
              </div>
              <div className="hidden lg:inline text-slate-300">•</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span className="font-medium text-slate-700 capitalize">{calledBooking.status}</span>
                <span className="text-slate-400">at {calledBooking.counter_assigned || activeCounter}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500 border-l-0 sm:border-l border-slate-200 sm:pl-6">
              No token currently being served. Click call to summon the next queued farmer.
            </span>
          )}

        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          
          {/* Desk Selector */}
          <select
            value={activeCounter}
            onChange={(e) => setActiveCounter(e.target.value)}
            className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 font-medium focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="Gate Entry 1">Gate Entry 1</option>
            <option value="Gate Entry 2">Gate Entry 2</option>
            <option value="Quality Lab 1">Quality Lab 1</option>
            <option value="Weighbridge 1">Weighbridge 1</option>
            <option value="Counter 3 - DBT">Counter 3 - DBT</option>
          </select>

          {/* Primary Action Button */}
          <button
            id="admin-call-next-btn"
            onClick={handleCallNext}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5 active:scale-[0.99]"
          >
            <span>Call Next Token</span>
            <span className="font-mono text-emerald-200 text-[10px]">↵</span>
          </button>

        </div>

      </div>
    </div>
  );
};
