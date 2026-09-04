import React from 'react';
import { CROPS } from '../../../lib/mockData';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          State Procurement System Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Government Minimum Support Price (MSP) schedule & queue congestion thresholds
        </p>
      </div>

      {/* MSP Schedule */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <h3 className="font-semibold text-xs text-slate-900">Official Government MSP Rates (Kharif/Rabi 2026)</h3>
        
        <div className="divide-y divide-slate-100 text-xs">
          {CROPS.map((crop) => (
            <div key={crop.name} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-900 block">{crop.name}</span>
                <span className="text-[11px] text-slate-400">Max permissible moisture: {crop.moistureLimit}</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 text-sm">₹{crop.msp}</span>
                <span className="text-slate-400 text-[11px] block">/ Quintal</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Congestion Thresholds */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3 text-xs">
        <h3 className="font-semibold text-xs text-slate-900">Congestion Alert Thresholds</h3>
        
        <div className="space-y-2 text-slate-600">
          <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
            <span>Critical Congestion Trigger</span>
            <span className="font-mono font-semibold text-red-700">&gt; 90 minutes average wait</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
            <span>Warning Delay Trigger</span>
            <span className="font-mono font-semibold text-amber-700">&gt; 30 minutes average wait</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
            <span>Optimal Queue Flow</span>
            <span className="font-mono font-semibold text-emerald-700">&lt; 30 minutes average wait</span>
          </div>
        </div>
      </div>
    </div>
  );
};
