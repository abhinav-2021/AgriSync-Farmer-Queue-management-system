import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { AgriSyncLogo } from '../common/AgriSyncLogo';
import type { StateFilter } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Search,
  Bell,
  AlertTriangle,
  Home,
  Globe,
  ChevronDown,
  MapPin,
  LogOut
} from 'lucide-react';

export const AdminTopHeader: React.FC = () => {
  const {
    setIsSidebarOpenMobile,
    globalSearchQuery,
    setGlobalSearchQuery,
    portalView,
    setPortalView,
    mandis,
    isRealtimeConnected,
    selectedStateFilter,
    setSelectedStateFilter
  } = useQueue();
  const { profile, signOut } = useAuth();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const filteredMandis = selectedStateFilter === 'all'
    ? mandis
    : mandis.filter((m) => m.state === selectedStateFilter);

  const alertMandis = filteredMandis.filter((m) => m.status === 'critical' || m.status === 'warning');

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 shadow-xs">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Mobile Sidebar Trigger + Brand Emblem on Mobile + Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          
          <button
            onClick={() => setIsSidebarOpenMobile(true)}
            aria-label="Open navigation menu"
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setPortalView('landing')}
            className="md:hidden flex items-center"
            title="Go to Landing Page"
          >
            <AgriSyncLogo variant="icon" size="sm" />
          </button>

          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Centres, Farmers, Operators..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-colors"
            />
            {globalSearchQuery && (
              <button
                onClick={() => setGlobalSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                ×
              </button>
            )}
          </div>

        </div>

        {/* Center/Right: Prominent Global State Filter */}
        <div className="hidden md:flex items-center gap-2">
          <label htmlFor="header-state-selector" className="text-[11px] font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span>Jurisdiction:</span>
          </label>
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-emerald-700 absolute left-2.5 pointer-events-none" />
            <select
              id="header-state-selector"
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value as StateFilter)}
              className="pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 rounded-md text-xs font-semibold text-slate-800 shadow-2xs appearance-none cursor-pointer transition-colors"
              title="Select State Overview"
            >
              <option value="all">National Overview (All)</option>
              <option value="Haryana">Haryana</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Punjab">Punjab</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>

        {/* Right: Workspace Switcher, Alerts & Profile */}
        <div className="flex items-center gap-3">
          
          <div className="hidden xl:flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
            <button
              onClick={() => setPortalView('landing')}
              className="px-2.5 py-1.5 rounded text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
              title="Home Landing"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setPortalView('state-admin')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                portalView === 'state-admin'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              State Overview
            </button>
            <button
              onClick={() => setPortalView('mandi-desk')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                portalView === 'mandi-desk'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mandi Yard Desk
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <span
              className={`w-2 h-2 rounded-full ${
                isRealtimeConnected ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="text-[11px] font-medium hidden xl:inline">Live State Sync</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
              title="State alerts & notifications"
            >
              <Bell className="w-4 h-4" />
              {alertMandis.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 text-xs animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 font-semibold text-slate-900">
                  <span>State Queue Alerts</span>
                  <span className="text-[10px] text-slate-400 font-mono">{alertMandis.length} Active</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alertMandis.map((mandi) => (
                    <div
                      key={mandi.id}
                      className="p-2 rounded bg-slate-50 border border-slate-100 flex items-start gap-2"
                    >
                      <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                        mandi.status === 'critical' ? 'text-red-600' : 'text-amber-600'
                      }`} />
                      <div>
                        <p className="font-semibold text-slate-800">{mandi.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {mandi.waitTimeMinutes} mins wait • {mandi.activeVehicles} vehicles in queue
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
              {(profile?.full_name || 'Admin').substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-slate-900 block leading-tight truncate max-w-[120px]">
                {profile?.full_name || 'Directorate Admin'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Level 1 Admin
              </span>
            </div>
            <button
              onClick={async () => {
                await signOut();
                setPortalView('landing');
              }}
              title="Sign Out"
              className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
