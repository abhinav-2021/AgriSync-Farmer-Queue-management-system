import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueueProvider, useQueue } from './context/QueueContext';
import { LandingPage } from './components/landing/LandingPage';
import { Header } from './components/common/Header';
import { StateAdminPortal } from './components/stateAdmin/StateAdminPortal';
import { ProcurementDashboard } from './components/admin/ProcurementDashboard';
import { FarmerPortal } from './components/farmer/FarmerPortal';
import { ToastContainer } from './components/common/ToastContainer';

import { AccessDenied } from './components/common/AccessDenied';

const AppContent: React.FC = () => {
  const { portalView, setPortalView, loginFarmer, triggerToast } = useQueue();
  const { profile, userRole, isAuthenticated } = useAuth();

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

  // 1. Landing Page (Public)
  if (portalView === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  // 2. State Admin Portal (Requires Admin Credentials)
  if (portalView === 'state-admin') {
    if (!isAuthenticated || userRole !== 'admin') {
      return (
        <>
          <AccessDenied requiredRole="admin" />
          <ToastContainer />
        </>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <StateAdminPortal />
        <ToastContainer />
      </div>
    );
  }

  // 3. Mandi Command Center (Requires Operator or Admin Credentials)
  if (portalView === 'mandi-desk') {
    if (!isAuthenticated || (userRole !== 'operator' && userRole !== 'admin')) {
      return (
        <>
          <AccessDenied requiredRole="operator" />
          <ToastContainer />
        </>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Header />
        <main className="flex-1 w-full pb-12">
          <ProcurementDashboard />
        </main>
        <ToastContainer />
      </div>
    );
  }

  // 4. Farmer Portal (Authenticated or Farmer Registration Flow)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />
      <main className="flex-1 w-full pb-12">
        <FarmerPortal />
      </main>
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
