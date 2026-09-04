import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueueProvider, useQueue } from './context/QueueContext';
import { LandingPage } from './components/landing/LandingPage';
import { Header } from './components/common/Header';
import { StateAdminPortal } from './components/stateAdmin/StateAdminPortal';
import { ProcurementDashboard } from './components/admin/ProcurementDashboard';
import { FarmerPortal } from './components/farmer/FarmerPortal';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const { portalView, setPortalView, loginFarmer, triggerToast } = useQueue();
  const { profile } = useAuth();

  // Listen for active Supabase incoming auth redirects (Magic link callback)
  useEffect(() => {
    const isAuthRedirect =
      typeof window !== 'undefined' &&
      (window.location.hash.includes('access_token') || window.location.search.includes('code='));

    if (isAuthRedirect) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (profile && isAuthRedirect) {
      if (profile.role === 'farmer') {
        loginFarmer(
          profile.phone || profile.email.split('@')[0],
          profile.full_name,
          profile.district || 'Agricultural Region',
          profile.state || 'Haryana'
        );
        setPortalView('farmer');
        triggerToast({
          title: 'Email Verified Successfully',
          message: `Welcome, ${profile.full_name}! Digital slot booking active.`,
          type: 'success'
        });
      } else if (profile.role === 'admin') {
        setPortalView('state-admin');
        triggerToast({
          title: 'State Master Authenticated',
          message: `Welcome, ${profile.full_name}.`,
          type: 'success'
        });
      } else if (profile.role === 'operator') {
        setPortalView('mandi-desk');
        triggerToast({
          title: 'Mandi Desk Authenticated',
          message: `Welcome, ${profile.full_name}.`,
          type: 'success'
        });
      }
    }
  }, [profile]);

  if (portalView === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  if (portalView === 'state-admin') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <StateAdminPortal />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header />

      {/* Main Workspace */}
      <main className="flex-1 w-full pb-12">
        {portalView === 'farmer' ? (
          <FarmerPortal />
        ) : (
          <ProcurementDashboard />
        )}
      </main>

      {/* Toast Stack */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <QueueProvider>
        <AppContent />
      </QueueProvider>
    </AuthProvider>
  );
}

export default App;
