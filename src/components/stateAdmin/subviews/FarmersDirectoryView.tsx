import React, { useState } from 'react';
import { MOCK_FARMERS } from '../../../lib/mockData';
import { Search, ShieldCheck } from 'lucide-react';

export const FarmersDirectoryView: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_FARMERS.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.phone.includes(search) ||
      f.village.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Registered Farmers (45,210 Total)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Aadhaar KYC verified farmer landholdings and procurement quotas
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search farmer, phone, or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Farmer Name</th>
                <th className="py-2.5 px-4">Mobile & Aadhaar</th>
                <th className="py-2.5 px-4">Village / State</th>
                <th className="py-2.5 px-4">Land Holding</th>
                <th className="py-2.5 px-4">Total Procured</th>
                <th className="py-2.5 px-4 text-right">KYC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {farmer.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    +91 {farmer.phone}
                    <span className="text-[10px] text-slate-400 block">UID: XXXX-XXXX-{farmer.aadhaar_last4 || '4392'}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {farmer.village}, {farmer.state || 'Haryana'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {farmer.land_hectares || 3.5} Hectares
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-800">
                    {farmer.total_procured_qtl || 120} Quintals
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
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
