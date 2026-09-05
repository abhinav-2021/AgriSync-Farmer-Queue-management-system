import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { QueueMetrics } from './QueueMetrics';
import { CallNextControl } from './CallNextControl';
import { BookingsTable } from './BookingsTable';
import { WalkInModal } from './WalkInModal';
import { Download, Plus } from 'lucide-react';

export const ProcurementDashboard: React.FC = () => {
  const { bookings } = useQueue();
  const { profile } = useAuth();
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);

  const todayDateFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  const handleExportCsv = () => {
    const headers = ['Token Number,Farmer Name,Phone,Village,Crop,Quintals,Vehicle,Slot Time,Status,Total MSP (INR)'];
    const rows = bookings.map((b) =>
      `"${b.token_number}","${b.farmer_name}","${b.farmer_phone}","${b.farmer_village}","${b.crop_type}","${b.actual_weight_quintals || b.estimated_quintals}","${b.vehicle_number}","${b.slot_time}","${b.status}","${b.total_payout || 0}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgriSync_Procurement_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Header with Title, Location, Date & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Procurement Command Center
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-700">
              {profile?.mandi_name
                ? `${profile.mandi_name} • ${profile.state || 'State APMC'}`
                : 'APMC Mandi Yard • Karnal, Haryana'}
            </span>
            <span>•</span>
            <span>{todayDateFormatted}</span>
            <span>•</span>
            <span className="text-emerald-700">Live Sync Active</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
            title="Download daily procurement CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            id="admin-walkin-btn"
            onClick={() => setIsWalkInOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-md shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Walk-in</span>
          </button>
        </div>
      </div>

      {/* 2. Compact KPI Summary Row */}
      <QueueMetrics />

      {/* 3. Horizontal Active Queue Focus Section */}
      <CallNextControl />

      {/* 4. Main Operational Bookings Table */}
      <BookingsTable />

      {/* 5. Walk-In Registration Modal */}
      <WalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
      />

    </div>
  );
};
