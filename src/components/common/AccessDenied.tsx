import React from 'react';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Lock, ArrowLeft, LogIn, CheckCircle2 } from 'lucide-react';
import { AgriSyncLogo } from './AgriSyncLogo';

interface AccessDeniedProps {
  requiredRole: 'admin' | 'operator' | 'farmer';
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredRole }) => {
  const { setPortalView } = useQueue();
  const { userRole, profile, signOut } = useAuth();

  const roleLabels: Record<string, { title: string; desc: string; badgeColor: string }> = {
    admin: {
      title: 'State Government Admin Authorization Required',
      desc: 'This portal is restricted to authorized State Directorate administrators and APMC state officials. Access requires Level 1 security clearance.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    operator: {
      title: 'APMC Mandi Yard Operator Clearance Required',
      desc: 'This command desk is restricted to authorized APMC Mandi yard inspectors, weighbridge operators, and clearance staff.',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    farmer: {
      title: 'Farmer Identity Verification Required',
      desc: 'This workspace is restricted to registered farmers for digital slot booking and live token tracking.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  };

  const config = roleLabels[requiredRole] || roleLabels.admin;

  const handleSignInWithCredentials = () => {
    // Navigate to landing page with the required role in the hash so the correct form opens
    window.location.hash = requiredRole;
    setPortalView('landing');
  };

  const handleReturnToWorkspace = () => {
    if (userRole === 'farmer') {
      setPortalView('farmer');
    } else if (userRole === 'operator') {
      setPortalView('mandi-desk');
    } else if (userRole === 'admin') {
      setPortalView('state-admin');
    } else {
      setPortalView('landing');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rose-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-950/80 border border-slate-800 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 text-center space-y-6">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-2">
          <AgriSyncLogo variant="on-dark" size="md" />
        </div>

        {/* Security Shield Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
          <ShieldAlert className="w-8 h-8 text-rose-500 animate-pulse" />
        </div>

        {/* Title & Badge */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60">
            <Lock className="w-3 h-3 text-rose-400" />
            Access Restricted • 403 Forbidden
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {config.title}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {config.desc}
          </p>
        </div>

        {/* Current Identity Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-left space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Your Current Role:</span>
            <span className="font-semibold text-white capitalize bg-slate-800 px-2 py-0.5 rounded text-[11px]">
              {userRole || 'Unauthenticated Guest'}
            </span>
          </div>
          {profile && (
            <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
              <span>Signed In As:</span>
              <span className="font-mono text-emerald-400 truncate max-w-[200px]">
                {profile.full_name || profile.email}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleSignInWithCredentials}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with {requiredRole === 'admin' ? 'State Admin' : 'Mandi Operator'} Credentials</span>
          </button>

          {userRole ? (
            <button
              onClick={handleReturnToWorkspace}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to My Authorized Workspace ({userRole})</span>
            </button>
          ) : (
            <button
              onClick={() => setPortalView('landing')}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Home</span>
            </button>
          )}

          {profile && (
            <button
              onClick={async () => {
                await signOut();
                setPortalView('landing');
              }}
              className="w-full py-2 text-xs text-rose-400 hover:text-rose-300 hover:underline transition-colors"
            >
              Sign out from current session
            </button>
          )}
        </div>

        {/* Security Policy Notice */}
        <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-500/70" />
          <span>Secured by AgriSync Strict Role-Based Access Control (RBAC)</span>
        </div>

      </div>
    </div>
  );
};
