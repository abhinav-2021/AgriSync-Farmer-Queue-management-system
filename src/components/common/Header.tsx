import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { AgriSyncLogo } from './AgriSyncLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Volume2, VolumeX, RotateCcw, Home, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useTranslation(['nav', 'common']);
  const {
    portalView,
    setPortalView,
    soundEnabled,
    setSoundEnabled,
    resetToMockData,
    isRealtimeConnected,
    activeCalledToken,
    currentFarmer,
    logoutFarmer
  } = useQueue();
  const { profile, isAuthenticated, userRole, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Left Navigation */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setPortalView('landing')}
              className="flex items-center focus:outline-none hover:opacity-90 transition-opacity"
              title="Return to AgriSync Home"
            >
              <AgriSyncLogo variant="navbar" />
            </button>

            {/* Role-Specific Main Navigation */}
            <nav className="flex items-center gap-1.5 border-l border-slate-200 pl-4 sm:pl-5">
              <button
                onClick={() => setPortalView('landing')}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1"
                title={t('home', 'Home')}
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('home', 'Home')}</span>
              </button>

              {/* 1. Farmer Portal Active Workspace Badge (Only for Farmers) */}
              {(currentFarmer || userRole === 'farmer') && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>🌾 {t('farmerPortal', 'Farmer Portal')}</span>
                </div>
              )}

              {/* 2. Mandi Desk Active Workspace Badge (Only for Operators) */}
              {userRole === 'operator' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span>🏢 {profile?.mandi_name ? `${profile.mandi_name}` : t('procurementDashboard', 'Mandi Command Desk')}</span>
                </div>
              )}

              {/* 3. State Admin Active Workspace (Only for Admins) */}
              {userRole === 'admin' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPortalView('state-admin')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      portalView === 'state-admin'
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    🏛️ {t('stateAdmin', 'State Admin')}
                  </button>
                  <button
                    onClick={() => setPortalView('mandi-desk')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      portalView === 'mandi-desk'
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    🏢 {t('procurementDashboard', 'Mandi Command Desk')}
                  </button>
                </div>
              )}

              {/* 4. Guest / Unauthenticated: Show link to access authorized portals */}
              {!currentFarmer && !userRole && (
                <button
                  onClick={() => {
                    setPortalView('landing');
                    setTimeout(() => {
                      const el = document.getElementById('portals');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1"
                >
                  <span>Sign In to Portals</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Status & Tools */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Active Serving Pill */}
            {activeCalledToken && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
                <span className="text-slate-400 font-normal">{t('activeServing', 'Active')}:</span>
                <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  #{activeCalledToken}
                </span>
              </div>
            )}

            {/* Realtime Status Indicator */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRealtimeConnected ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span className="hidden md:inline text-[11px] text-slate-500 font-medium">
                {isRealtimeConnected ? t('realtimeSync', 'Real-Time Sync') : t('connecting', 'Connecting')}
              </span>
            </div>

            {/* Premium Language Switcher Dropdown */}
            <LanguageSwitcher variant="compact" />

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? t('muteAudio', 'Mute audio notifications') : t('enableAudio', 'Enable audio notifications')}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Reset data */}
            <button
              onClick={resetToMockData}
              title={t('resetData', 'Reset initial queue data')}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Authenticated User or Farmer Chip & Sign Out */}
            {(isAuthenticated || currentFarmer) && (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-semibold text-slate-800 block leading-tight truncate max-w-[150px]">
                    {currentFarmer?.name || profile?.full_name || 'User'}
                  </span>
                  <span className="text-[10px] text-slate-400 block capitalize truncate max-w-[150px]">
                    {currentFarmer
                      ? 'Farmer'
                      : profile?.mandi_name
                      ? `Operator • ${profile.mandi_name}`
                      : (profile?.role || userRole || 'Member')}
                  </span>
                </div>
                <button
                  onClick={async () => {
                    logoutFarmer();
                    await signOut();
                    setPortalView('landing');
                  }}
                  title={t('signOut', 'Sign Out')}
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium hidden md:inline">Sign Out</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
