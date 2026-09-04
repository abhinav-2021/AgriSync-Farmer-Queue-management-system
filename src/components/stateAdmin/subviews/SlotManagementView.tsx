import React from 'react';
import { AVAILABLE_TIME_SLOTS } from '../../../lib/mockData';

export const SlotManagementView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Slot Capacity & Traffic Throttling
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure maximum allowable truck/trolley arrivals per hourly time window
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {AVAILABLE_TIME_SLOTS.map((slot, idx) => (
          <div key={slot} className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">{slot}</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Slot {idx + 1}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Maximum Capacity:</span>
                <span className="font-mono font-semibold text-slate-900">40 Trucks / Hr</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Booked Today:</span>
                <span className="font-mono font-semibold text-emerald-800">
                  {30 + ((idx * 3) % 10)} / 40
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${((30 + ((idx * 3) % 10)) / 40) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Gate Flow: Normal</span>
              <button className="text-emerald-700 hover:text-emerald-800 font-medium">
                Adjust Limit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
