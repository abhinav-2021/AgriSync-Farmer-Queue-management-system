import React from 'react';
import { useQueue } from '../../context/QueueContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopHeader } from './AdminTopHeader';
import { StateKpiRow } from './StateKpiRow';
import { ProcurementTrendChart } from './ProcurementTrendChart';
import { CongestionAlertsCard } from './CongestionAlertsCard';
import { CentresView } from './subviews/CentresView';
import { FarmersDirectoryView } from './subviews/FarmersDirectoryView';
import { OperatorsView } from './subviews/OperatorsView';
import { SlotManagementView } from './subviews/SlotManagementView';
import { AnalyticsView } from './subviews/AnalyticsView';
import { SettingsView } from './subviews/SettingsView';
import { Download, Calendar } from 'lucide-react';

export const StateAdminPortal: React.FC = () => {
  const { adminTab, selectedStateFilter, setSelectedStateFilter } = useQueue();

  const todayDateFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const stateOptions: Array<{ id: typeof selectedStateFilter; label: string }> = [
    { id: 'all', label: '🌐 National Overview (All)' },
    { id: 'Haryana', label: 'Haryana' },
    { id: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { id: 'Punjab', label: 'Punjab' },
    { id: 'Bihar', label: 'Bihar' },
    { id: 'Uttar Pradesh', label: 'Uttar Pradesh' }
  ];

  const getHeadingTitle = () => {
    if (selectedStateFilter === 'all') {
      return 'National Procurement Command Center • Multi-State APMC Grid';
    }
    return `State-Wide Procurement Overview: ${selectedStateFilter} Division`;
  };

  const getSubheading = () => {
    if (selectedStateFilter === 'all') {
      return 'Real-time national aggregation across Haryana, Madhya Pradesh, Punjab, Bihar & Uttar Pradesh';
    }
    return `Real-time state APMC operations, yard turnaround times & DBT pipeline for ${selectedStateFilter}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      
      {/* 1. Left Fixed Dark Sidebar */}
      <AdminSidebar />

      {/* 2. Main Content Wrapper (offset by sidebar width on desktop) */}
      <div className="flex-1 md:pl-60 flex flex-col min-w-0">
        
        {/* Top Header */}
        <AdminTopHeader />

        {/* Dynamic Main View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {adminTab === 'dashboard' && (
            <>
              {/* Page Title & Meta */}
              <div className="space-y-3 pb-2 border-b border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {getHeadingTitle()}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{todayDateFormatted}</span>
                      <span>•</span>
                      <span className="text-emerald-700">{getSubheading()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Export State Brief</span>
                    </button>
                  </div>
                </div>

                {/* State Overview Quick Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1 flex-shrink-0">
                    State Scope:
                  </span>
                  {stateOptions.map((opt) => {
                    const isActive = selectedStateFilter === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedStateFilter(opt.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Top Row (KPI Cards) */}
              <StateKpiRow />

              {/* Step 3: Lower Data Visualizations Section (2/3 left, 1/3 right) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* Left Pane: Procurement Trend Bar Chart (2/3 width) */}
                <div className="lg:col-span-2">
                  <ProcurementTrendChart />
                </div>

                {/* Right Pane: Live Congestion Alerts (1/3 width) */}
                <div className="lg:col-span-1">
                  <CongestionAlertsCard />
                </div>

              </div>
            </>
          )}

          {adminTab === 'centres' && <CentresView />}
          {adminTab === 'farmers' && <FarmersDirectoryView />}
          {adminTab === 'operators' && <OperatorsView />}
          {adminTab === 'slots' && <SlotManagementView />}
          {adminTab === 'analytics' && <AnalyticsView />}
          {adminTab === 'settings' && <SettingsView />}

        </main>
      </div>

    </div>
  );
};
