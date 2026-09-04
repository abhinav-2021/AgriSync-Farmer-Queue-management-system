import React, { useState } from 'react';
import { useQueue } from '../../../context/QueueContext';
import type { MandiCenter } from '../../../types';
import { Search, ExternalLink } from 'lucide-react';

export const CentresView: React.FC = () => {
  const { mandis, setPortalView, selectedStateFilter } = useQueue();
  const [search, setSearch] = useState('');

  const filtered = mandis.filter((m: MandiCenter) => {
    const matchesState = selectedStateFilter === 'all' || m.state === selectedStateFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.district.toLowerCase().includes(search.toLowerCase()) ||
      (m.state && m.state.toLowerCase().includes(search.toLowerCase())) ||
      m.headOperator.toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesSearch;
  });

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Procurement Centres Directory ({selectedStateFilter === 'all' ? 'National Grid' : selectedStateFilter} • {filtered.length} Mandis)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active APMC Mandis, weighbridge capacity, and turnaround times
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mandi, district or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Center / District</th>
                <th className="py-2.5 px-4">State</th>
                <th className="py-2.5 px-4">Status & Wait</th>
                <th className="py-2.5 px-4">Active Yard Queue</th>
                <th className="py-2.5 px-4">Today's Tonnage</th>
                <th className="py-2.5 px-4">Superintendent</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((mandi: MandiCenter) => (
                <tr key={mandi.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{mandi.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{mandi.district} District</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {mandi.state || 'Haryana'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                      mandi.status === 'critical'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : mandi.status === 'warning'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {mandi.waitTimeMinutes} mins wait
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 font-medium">
                    {mandi.activeVehicles} vehicles ({mandi.activeCounters} counters open)
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-slate-900 font-semibold block">{mandi.todayQuintals.toLocaleString()} Qtl</span>
                    <span className="text-[10px] text-slate-400 font-mono">Cap: {mandi.dailyCapacity.toLocaleString()} Qtl</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {mandi.headOperator}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setPortalView('mandi-desk')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded transition-colors inline-flex items-center gap-1"
                    >
                      <span>Open Desk</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
