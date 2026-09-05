import React, { useState } from 'react';
import { useQueue } from '../../../context/QueueContext';
import type { MandiCenter } from '../../../types';
import { Search, Plus, KeyRound, Trash2, AlertTriangle, Building2 } from 'lucide-react';
import { AddMandiModal } from './AddMandiModal';
import { ViewCredentialsModal } from './ViewCredentialsModal';

export const CentresView: React.FC = () => {
  const { mandis, removeMandi, selectedStateFilter } = useQueue();
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMandiForCreds, setSelectedMandiForCreds] = useState<MandiCenter | null>(null);
  const [deletingMandi, setDeletingMandi] = useState<MandiCenter | null>(null);

  const filtered = mandis.filter((m: MandiCenter) => {
    const matchesState = selectedStateFilter === 'all' || m.state === selectedStateFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.district.toLowerCase().includes(search.toLowerCase()) ||
      (m.state && m.state.toLowerCase().includes(search.toLowerCase())) ||
      m.headOperator.toLowerCase().includes(search.toLowerCase()) ||
      (m.officialEmail && m.officialEmail.toLowerCase().includes(search.toLowerCase()));
    return matchesState && matchesSearch;
  });

  const handleConfirmDelete = () => {
    if (deletingMandi) {
      removeMandi(deletingMandi.id);
      setDeletingMandi(null);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header with Search and Add Mandi CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Procurement Centres Directory</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {filtered.length} Mandis
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active APMC Mandis, weighbridge capacity, and provisioned operator access credentials
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mandi, district or operator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Mandi Centre</span>
          </button>
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
                <th className="py-2.5 px-4">Capacity & Tonnage</th>
                <th className="py-2.5 px-4">Superintendent</th>
                <th className="py-2.5 px-4 text-right">Credentials & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No Mandi centres found matching criteria</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try refining your search filter or register a new Mandi center.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((mandi: MandiCenter) => (
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
                      {mandi.activeVehicles} vehicles ({mandi.activeCounters} counters)
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-900 font-semibold block">{mandi.todayQuintals.toLocaleString()} Qtl</span>
                      <span className="text-[10px] text-slate-400 font-mono">Cap: {mandi.dailyCapacity.toLocaleString()} Qtl</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-medium text-slate-800 block">{mandi.headOperator}</span>
                      {mandi.contactPhone && (
                        <span className="text-[10px] text-slate-400 font-mono block">{mandi.contactPhone}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Credentials Button */}
                        <button
                          onClick={() => setSelectedMandiForCreds(mandi)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium text-xs rounded transition-colors inline-flex items-center gap-1"
                          title="View Mandi Operator Login Credentials"
                        >
                          <KeyRound className="w-3 h-3 text-purple-600" />
                          <span>Credentials</span>
                        </button>

                        {/* Remove Mandi Button */}
                        <button
                          onClick={() => setDeletingMandi(mandi)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title={`Remove ${mandi.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Mandi Modal */}
      <AddMandiModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultState={selectedStateFilter}
      />

      {/* View Credentials Modal */}
      <ViewCredentialsModal
        mandi={selectedMandiForCreds}
        onClose={() => setSelectedMandiForCreds(null)}
      />

      {/* Deletion Confirmation Modal */}
      {deletingMandi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 text-xs text-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-red-100 text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Decommission Mandi Center?
                </h3>
                <p className="text-[11px] text-slate-500">
                  Permanent removal from APMC Directory
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1">
              <div className="font-semibold text-slate-900">{deletingMandi.name}</div>
              <div className="text-slate-500 text-[11px]">{deletingMandi.district} District • {deletingMandi.state}</div>
              <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-200/60">
                Email: {deletingMandi.officialEmail || 'Auto-assigned'}
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-[11px]">
              This action will remove the Mandi from the state grid and immediately revoke operator login privileges associated with its credentials.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingMandi(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Removal</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

