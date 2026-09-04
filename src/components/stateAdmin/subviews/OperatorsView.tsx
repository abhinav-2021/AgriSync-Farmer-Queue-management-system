import React from 'react';
import { MOCK_OPERATORS } from '../../../lib/mockData';

export const OperatorsView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Procurement Operators & Duty Stations
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Gate staff, moisture testers, weighbridge operators, and accounts personnel
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Operator Name</th>
                <th className="py-2.5 px-4">Assigned Role</th>
                <th className="py-2.5 px-4">Center / Mandi</th>
                <th className="py-2.5 px-4">Tokens Processed Today</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_OPERATORS.map((op) => (
                <tr key={op.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {op.name}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {op.role}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {op.center}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    {op.tokensProcessed} tokens
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      On Duty
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
