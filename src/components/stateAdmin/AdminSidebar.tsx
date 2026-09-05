import React from 'react';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import type { AdminTab } from '../../types';
import { AgriSyncLogo } from '../common/AgriSyncLogo';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  CalendarClock,
  Radio,
  BarChart3,
  Settings,
  X,
  ExternalLink,
  Home,
  LogOut
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    isSidebarOpenMobile,
    setIsSidebarOpenMobile,
    setPortalView
  } = useQueue();
  const { profile, signOut } = useAuth();

  const navigationItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'centres', label: 'Procurement Centres', icon: <Building2 className="w-4 h-4" />, badge: '142' },
    { id: 'farmers', label: 'Farmers', icon: <Users className="w-4 h-4" /> },
    { id: 'operators', label: 'Operators', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'slots', label: 'Slot Management', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'live-queue', label: 'Live Queue', icon: <Radio className="w-4 h-4" />, badge: 'Live' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleTabClick = (tabId: AdminTab) => {
    if (tabId === 'live-queue') {
      setPortalView('mandi-desk');
    } else {
      setAdminTab(tabId);
    }
    setIsSidebarOpenMobile(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-slate-900 text-slate-300 font-sans border-r border-slate-800">
      
      {/* Brand Header with Emblem & Wordmark */}
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setPortalView('landing')}
              className="bg-white p-1 rounded-lg flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity"
              title="Return to Public Landing Page"
            >
              <AgriSyncLogo variant="icon" size="sm" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white tracking-tight">
                  AgriSync
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700/50">
                  State
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                Haryana APMC Master
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsSidebarOpenMobile(false)}
            aria-label="Close sidebar"
            className="md:hidden p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
            Navigation
          </span>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded ${
                        isActive
                          ? 'bg-emerald-700 text-white'
                          : item.badge === 'Live'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile & Switcher Footer */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        
        {/* Admin Quick Navigation */}
        <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/60 text-xs">
          <span className="text-[10px] text-slate-400 font-medium block mb-1.5">
            Admin Navigation
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setPortalView('landing')}
              className="py-1 px-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="Public Home"
            >
              <Home className="w-3 h-3 opacity-70" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setPortalView('mandi-desk')}
              className="py-1 px-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="APMC Mandi Clearance Desk"
            >
              <span>Mandi Desk</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </button>
          </div>
        </div>

        {/* User Card & Sign Out */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/40 border border-slate-800 transition-colors">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'SS'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate leading-tight">
                {profile?.full_name || 'Director S. Sharma'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {profile?.email || 'Haryana APMC Master'}
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>

          <button
            onClick={async () => {
              await signOut();
              setPortalView('landing');
            }}
            className="w-full py-1.5 px-2 rounded-md hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside aria-label="State Navigation" className="hidden md:block fixed inset-y-0 left-0 w-60 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isSidebarOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsSidebarOpenMobile(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
