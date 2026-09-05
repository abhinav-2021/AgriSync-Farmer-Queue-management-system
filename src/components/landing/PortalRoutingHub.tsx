import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import {
  Tractor,
  Building2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Phone,
  Mail,
  RotateCcw,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

type SelectedRole = 'farmer' | 'operator' | 'admin' | null;

export const PortalRoutingHub: React.FC = () => {
  const { t } = useTranslation(['landing', 'common']);
  const { setPortalView, loginFarmer, triggerToast } = useQueue();
  const {
    sendPhoneOtp,
    verifyPhoneOtp,
    sendEmailOtp,
    verifyEmailOtp,
    signInWithPassword,
    clearError
  } = useAuth();

  const [selectedRole, setSelectedRole] = useState<SelectedRole>('farmer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // -------------------------------------------------------------
  // Farmer Form states
  // -------------------------------------------------------------
  const [farmerAuthMethod, setFarmerAuthMethod] = useState<'phone' | 'email'>('phone');
  const [farmerName, setFarmerName] = useState('');
  const [farmerState, setFarmerState] = useState('Haryana');
  const [farmerVillage, setFarmerVillage] = useState('');

  // Farmer Phone OTP
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerPhoneOtpStep, setFarmerPhoneOtpStep] = useState(false);
  const [farmerPhoneOtp, setFarmerPhoneOtp] = useState('');
  const [farmerPhoneCountdown, setFarmerPhoneCountdown] = useState(0);
  const [farmerPhoneIsSandbox, setFarmerPhoneIsSandbox] = useState(false);
  const [showFarmerPhoneOtp, setShowFarmerPhoneOtp] = useState(false);

  // Farmer Email OTP
  const [farmerEmail, setFarmerEmail] = useState('');
  const [farmerEmailOtpStep, setFarmerEmailOtpStep] = useState(false);
  const [farmerEmailOtp, setFarmerEmailOtp] = useState('');
  const [farmerEmailCountdown, setFarmerEmailCountdown] = useState(0);
  const [showFarmerEmailOtp, setShowFarmerEmailOtp] = useState(false);

  // -------------------------------------------------------------
  // Mandi Operator Form states
  // -------------------------------------------------------------
  const [mandiAuthMode, setMandiAuthMode] = useState<'otp' | 'password'>('otp');
  const [mandiEmail, setMandiEmail] = useState('mandi.karnal@agrisync.gov.in');
  const [mandiOtpStep, setMandiOtpStep] = useState(false);
  const [mandiOtp, setMandiOtp] = useState('');
  const [mandiPassword, setMandiPassword] = useState('Pass@1234');
  const [mandiCountdown, setMandiCountdown] = useState(0);
  const [showMandiOtp, setShowMandiOtp] = useState(false);
  const [showMandiPassword, setShowMandiPassword] = useState(false);

  // -------------------------------------------------------------
  // State Admin Form states
  // -------------------------------------------------------------
  const [adminAuthMode, setAdminAuthMode] = useState<'otp' | 'password'>('otp');
  const [adminEmail, setAdminEmail] = useState('director.sharma@agrisync.gov.in');
  const [adminOtpStep, setAdminOtpStep] = useState(false);
  const [adminOtp, setAdminOtp] = useState('');
  const [adminPassword, setAdminPassword] = useState('Pass@1234');
  const [adminCountdown, setAdminCountdown] = useState(0);
  const [showAdminOtp, setShowAdminOtp] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Countdown timers
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (farmerPhoneCountdown > 0) t = setTimeout(() => setFarmerPhoneCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [farmerPhoneCountdown]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (farmerEmailCountdown > 0) t = setTimeout(() => setFarmerEmailCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [farmerEmailCountdown]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (mandiCountdown > 0) t = setTimeout(() => setMandiCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [mandiCountdown]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (adminCountdown > 0) t = setTimeout(() => setAdminCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [adminCountdown]);

  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin' || hash === 'state-admin') {
        setSelectedRole('admin');
      } else if (hash === 'operator' || hash === 'mandi' || hash === 'mandi-desk') {
        setSelectedRole('operator');
      } else if (hash === 'farmer') {
        setSelectedRole('farmer');
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  const handleRoleChange = (role: SelectedRole) => {
    setSelectedRole(role);
    setFormError(null);
    setFormSuccess(null);
    clearError();
  };

  // -------------------------------------------------------------
  // FARMER: PHONE OTP ACTIONS
  // -------------------------------------------------------------
  const handleFarmerSendPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const clean = farmerPhone.replace(/\D/g, '');
    if (clean.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!farmerName.trim()) {
      setFormError('Please enter your full name as per Kisan/Aadhaar record.');
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await sendPhoneOtp(clean, {
      full_name: farmerName.trim(),
      state: farmerState,
      village: farmerVillage.trim()
    });
    setIsSubmitting(false);

    if (error) {
      setFormError(
        `${error.message || 'Unable to send SMS OTP'}. Tip: If phone provider is not configured in Supabase, you can use the Email OTP tab to verify via Supabase immediately.`
      );
      return;
    }

    setFarmerPhoneOtp('');
    setFarmerPhoneOtpStep(true);
    setFarmerPhoneCountdown(60);

    if (data?.mockSandbox) {
      setFarmerPhoneIsSandbox(true);
      setFormSuccess(
        'Sandbox Mode Active: Supabase SMS gateway is unconfigured. Use Demo OTP: 123456 (or click Auto-fill).'
      );
      triggerToast({
        title: 'SMS Sandbox Active',
        message: 'Phone gateway unconfigured. Use Demo OTP: 123456',
        type: 'info'
      });
    } else {
      setFarmerPhoneIsSandbox(false);
      setFormSuccess(`OTP sent to +91 ${clean} via SMS. Please enter the 6-digit code received on your mobile.`);
      triggerToast({
        title: 'SMS OTP Sent',
        message: `Verification code sent to +91 ${clean}.`,
        type: 'info'
      });
    }
  };

  const handleFarmerVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!farmerPhoneOtp || farmerPhoneOtp.trim().length < 6) {
      setFormError('Please enter the 6-digit OTP code received on your mobile.');
      return;
    }

    setIsSubmitting(true);
    const clean = farmerPhone.replace(/\D/g, '');
    const { error } = await verifyPhoneOtp(clean, farmerPhoneOtp, {
      full_name: farmerName.trim(),
      state: farmerState,
      village: farmerVillage.trim()
    });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || 'Invalid or expired OTP code.');
      return;
    }

    loginFarmer(clean, farmerName.trim(), farmerVillage.trim() || 'Agricultural Region', farmerState);
    setPortalView('farmer');
    triggerToast({
      title: 'Phone Verified Successfully',
      message: `Welcome, ${farmerName.trim()}! Digital slot booking active.`,
      type: 'success'
    });
  };

  // -------------------------------------------------------------
  // FARMER: EMAIL OTP ACTIONS
  // -------------------------------------------------------------
  const handleFarmerSendEmailOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const cleanEmail = farmerEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!farmerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await sendEmailOtp(cleanEmail, {
      full_name: farmerName.trim(),
      role: 'farmer',
      state: farmerState,
      phone: farmerPhone.replace(/\D/g, '')
    });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || 'Unable to send email OTP. Check Supabase project settings.');
      return;
    }

    setFarmerEmailOtp('');
    setFarmerEmailOtpStep(true);
    setFarmerEmailCountdown(60);
    setFormSuccess(
      `Verification dispatched to ${cleanEmail}. Enter the 6-digit OTP code, use test OTP 123456, or click the login link in your email.`
    );
    triggerToast({
      title: 'Email Verification Dispatched',
      message: `OTP sent to ${cleanEmail}. Test OTP 123456 is also active.`,
      type: 'info'
    });
  };

  const handleFarmerVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!farmerEmailOtp || farmerEmailOtp.trim().length < 6) {
      setFormError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    const cleanEmail = farmerEmail.trim().toLowerCase();
    const { error } = await verifyEmailOtp(cleanEmail, farmerEmailOtp, {
      full_name: farmerName.trim(),
      role: 'farmer',
      state: farmerState,
      phone: farmerPhone.replace(/\D/g, '')
    });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || 'Invalid or expired email OTP.');
      return;
    }

    const assignedPhone = farmerPhone.replace(/\D/g, '') || cleanEmail.split('@')[0];
    loginFarmer(assignedPhone, farmerName.trim(), farmerVillage.trim() || 'Agricultural Region', farmerState);
    setPortalView('farmer');
    triggerToast({
      title: 'Email Verified Successfully',
      message: `Welcome, ${farmerName.trim()}! Digital slot booking active.`,
      type: 'success'
    });
  };

  // -------------------------------------------------------------
  // OPERATOR ACTIONS
  // -------------------------------------------------------------
  const handleMandiSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);
    const clean = mandiEmail.trim().toLowerCase();
    if (!clean.includes('@')) {
      setFormError('Please enter a valid APMC official email.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await sendEmailOtp(clean, { role: 'operator', state: 'Haryana' });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || 'Failed to send OTP to operator email.');
      return;
    }

    setMandiOtpStep(true);
    setMandiCountdown(60);
    setFormSuccess(`Login OTP sent to ${clean}. Please check your inbox.`);
  };

  const handleMandiVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    const clean = mandiEmail.trim().toLowerCase();
    const { error } = await verifyEmailOtp(clean, mandiOtp, { role: 'operator', state: 'Haryana' });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || 'Invalid OTP code.');
      return;
    }

    setPortalView('mandi-desk');
    triggerToast({
      title: 'Mandi Desk Authenticated',
      message: `Verified session for ${clean}.`,
      type: 'success'
    });
  };

  const handleMandiPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const { error } = await signInWithPassword(mandiEmail, mandiPassword);
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || 'Authentication error. Please check credentials or use Email OTP.');
      return;
    }

    setPortalView('mandi-desk');
    triggerToast({
      title: 'Mandi Desk Authenticated',
      message: 'Logged into APMC Procurement Terminal.',
      type: 'success'
    });
  };

  // -------------------------------------------------------------
  // STATE ADMIN ACTIONS
  // -------------------------------------------------------------
  const handleAdminSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);
    const clean = adminEmail.trim().toLowerCase();
    if (!clean.includes('@')) {
      setFormError('Please enter a valid Directorate email.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await sendEmailOtp(clean, { role: 'admin', state: 'Haryana' });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || 'Failed to send OTP to admin email.');
      return;
    }

    setAdminOtpStep(true);
    setAdminCountdown(60);
    setFormSuccess(`Login OTP sent to ${clean}. Please check your inbox.`);
  };

  const handleAdminVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    const clean = adminEmail.trim().toLowerCase();
    const { error } = await verifyEmailOtp(clean, adminOtp, { role: 'admin', state: 'Haryana' });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || 'Invalid OTP code.');
      return;
    }

    setPortalView('state-admin');
    triggerToast({
      title: 'State Master Authenticated',
      message: `Director session verified for ${clean}.`,
      type: 'success'
    });
  };

  const handleAdminPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const { error } = await signInWithPassword(adminEmail, adminPassword);
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || 'Authentication error. Please check credentials or use Email OTP.');
      return;
    }

    setPortalView('state-admin');
    triggerToast({
      title: 'State Master Authenticated',
      message: 'Welcome Director - State Directorate.',
      type: 'success'
    });
  };

  return (
    <section id="portals" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
              {t('portals.universalBadge', 'Universal Procurement Access')}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50/90 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {t('portals.liveAuthBadge', 'Live Supabase Authentication')}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('portals.title', 'Role-Based Portal Access')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t('portals.subtitle', 'Sign in securely using Mobile OTP or Email OTP to access your designated workspace.')}
          </p>
        </div>

        {/* 3 Portal Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Farmer Portal */}
          <div
            onClick={() => handleRoleChange('farmer')}
            className={`cursor-pointer rounded-2xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between ${
              selectedRole === 'farmer'
                ? 'border-emerald-700 bg-emerald-50/30 shadow-md ring-2 ring-emerald-700/10'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-4">
                <Tractor className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {t('portals.farmerCard.title', 'For Farmers')}
                </h3>
                {selectedRole === 'farmer' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {t('portals.farmerCard.desc', 'Verify via Mobile OTP (SMS) or Email OTP to book delivery slots, track live tokens, and download QR gate passes.')}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-emerald-700">
              <span>{selectedRole === 'farmer' ? t('portals.farmerCard.active', 'Active Form Below') : t('portals.farmerCard.select', 'Select Farmer Access')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Mandi Operator Portal */}
          <div
            onClick={() => handleRoleChange('operator')}
            className={`cursor-pointer rounded-2xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between ${
              selectedRole === 'operator'
                ? 'border-purple-700 bg-purple-50/30 shadow-md ring-2 ring-purple-700/10'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {t('portals.operatorCard.title', 'For Mandi Operators')}
                </h3>
                {selectedRole === 'operator' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {t('portals.operatorCard.desc', 'Call next queued trucks, record laboratory moisture %, weigh loads, and disburse DBT payments.')}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-purple-700">
              <span>{selectedRole === 'operator' ? t('portals.operatorCard.active', 'Active Form Below') : t('portals.operatorCard.select', 'Select Operator Access')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Government State Admin */}
          <div
            onClick={() => handleRoleChange('admin')}
            className={`cursor-pointer rounded-2xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between ${
              selectedRole === 'admin'
                ? 'border-slate-900 bg-slate-100/40 shadow-md ring-2 ring-slate-900/10'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {t('portals.adminCard.title', 'For State Admins')}
                </h3>
                {selectedRole === 'admin' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {t('portals.adminCard.desc', 'Multi-state APMC monitoring, weighbridge operations, live congestion heatmaps, and procurement quotas.')}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-slate-900">
              <span>{selectedRole === 'admin' ? t('portals.adminCard.active', 'Active Form Below') : t('portals.adminCard.select', 'Select State Admin Access')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

        {/* Dynamic Interactive Login Forms Drawer */}
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm transition-all animate-fade-in">
          
          {/* Alerts */}
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 leading-relaxed">{formError}</div>
            </div>
          )}

          {formSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-xs text-emerald-800 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
              <div className="flex-1 leading-relaxed">{formSuccess}</div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 1. FARMER AUTHENTICATION (Mobile OTP / Email OTP) */}
          {/* ------------------------------------------------------------- */}
          {selectedRole === 'farmer' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Tractor className="w-5 h-5 text-emerald-700" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Farmer Access Verification
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      e-Kharid & Multi-State APMC Network
                    </span>
                  </div>
                </div>

                {/* Switcher */}
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setFarmerAuthMethod('phone');
                      setFormError(null);
                      setFormSuccess(null);
                    }}
                    className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                      farmerAuthMethod === 'phone'
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Phone className="w-3 h-3" />
                    <span>Mobile OTP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFarmerAuthMethod('email');
                      setFormError(null);
                      setFormSuccess(null);
                    }}
                    className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                      farmerAuthMethod === 'email'
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email OTP</span>
                  </button>
                </div>
              </div>

              {/* FARMER: MOBILE OTP */}
              {farmerAuthMethod === 'phone' && (
                !farmerPhoneOtpStep ? (
                  <form onSubmit={handleFarmerSendPhoneOtp} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Farmer Full Name <span className="text-emerald-700">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar Patel"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        10-Digit Mobile Number <span className="text-emerald-700">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-mono text-slate-400 font-medium">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          required
                          placeholder="9876543210"
                          value={farmerPhone}
                          onChange={(e) => setFarmerPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        A 6-digit verification code will be sent to your mobile phone via SMS.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Procurement State <span className="text-emerald-700">*</span>
                        </label>
                        <select
                          value={farmerState}
                          onChange={(e) => setFarmerState(e.target.value)}
                          className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                        >
                          <option value="Haryana">Haryana</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Village / Tehsil
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sihora / Panagar"
                          value={farmerVillage}
                          onChange={(e) => setFarmerVillage(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || farmerPhone.replace(/\D/g, '').length !== 10 || !farmerName.trim()}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{isSubmitting ? 'Dispatching SMS to Mobile...' : 'Send OTP on Mobile'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleFarmerVerifyPhoneOtp} className="space-y-4 text-xs animate-fade-in">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">SMS Verification Dispatched</span>
                        <span className="font-mono text-slate-600">+91 {farmerPhone}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Please enter the 6-digit OTP code received on your mobile phone via SMS.
                      </p>
                    </div>

                    {farmerPhoneIsSandbox && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900 animate-fade-in">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>
                            <strong>Demo Sandbox:</strong> Test OTP is{' '}
                            <code className="font-mono font-bold bg-amber-100 text-amber-800 px-1 py-0.5 rounded border border-amber-200">
                              123456
                            </code>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFarmerPhoneOtp('123456')}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] transition-colors shadow-2xs"
                        >
                          Auto-fill 123456
                        </button>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Enter 6-Digit Mobile OTP</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {showFarmerPhoneOtp ? 'Visible' : 'Hidden (Protected)'}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type={showFarmerPhoneOtp ? 'text' : 'password'}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="one-time-code"
                          maxLength={6}
                          autoFocus
                          required
                          placeholder="••••••"
                          value={farmerPhoneOtp}
                          onChange={(e) => setFarmerPhoneOtp(e.target.value.replace(/\D/g, ''))}
                          className={`w-full pl-10 pr-10 py-2.5 text-center tracking-[0.5em] bg-white border border-slate-200 rounded-lg font-mono text-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs transition-colors ${
                            showFarmerPhoneOtp ? 'otp-unmasked' : 'otp-masked'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowFarmerPhoneOtp(!showFarmerPhoneOtp)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors focus:outline-none"
                          title={showFarmerPhoneOtp ? 'Hide OTP (dots)' : 'Show OTP'}
                          aria-label={showFarmerPhoneOtp ? 'Hide OTP' : 'Show OTP'}
                        >
                          {showFarmerPhoneOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => setFarmerPhoneOtpStep(false)}
                        className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Change Mobile Number</span>
                      </button>

                      {farmerPhoneCountdown > 0 ? (
                        <span className="text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>Resend in {farmerPhoneCountdown}s</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleFarmerSendPhoneOtp()}
                          className="text-emerald-700 font-semibold hover:underline"
                        >
                          Resend SMS Code
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || farmerPhoneOtp.length < 6}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Verifying OTP with Supabase...' : 'Verify OTP & Enter Portal'}</span>
                    </button>
                  </form>
                )
              )}

              {/* FARMER: EMAIL OTP */}
              {farmerAuthMethod === 'email' && (
                !farmerEmailOtpStep ? (
                  <form onSubmit={handleFarmerSendEmailOtp} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Farmer Full Name <span className="text-emerald-700">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar Patel"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-emerald-700">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="farmer@example.com"
                        value={farmerEmail}
                        onChange={(e) => setFarmerEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        A 6-digit login OTP will be sent directly to your email inbox.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Procurement State <span className="text-emerald-700">*</span>
                        </label>
                        <select
                          value={farmerState}
                          onChange={(e) => setFarmerState(e.target.value)}
                          className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                        >
                          <option value="Haryana">Haryana</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Mobile Number (Optional)
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9876543210"
                          value={farmerPhone}
                          onChange={(e) => setFarmerPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !farmerEmail.includes('@') || !farmerName.trim()}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{isSubmitting ? 'Sending OTP to Email...' : 'Send OTP on Email'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleFarmerVerifyEmailOtp} className="space-y-4 text-xs animate-fade-in">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">Email OTP Dispatched</span>
                        <span className="font-mono text-slate-600">{farmerEmail}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Please check your inbox (and spam folder) for the 6-digit OTP code sent by Supabase.
                      </p>
                    </div>

                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900 animate-fade-in">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>
                          <strong>Demo Sandbox:</strong> Test OTP is{' '}
                          <code className="font-mono font-bold bg-amber-100 text-amber-800 px-1 py-0.5 rounded border border-amber-200">
                            123456
                          </code>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFarmerEmailOtp('123456')}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] transition-colors shadow-2xs"
                      >
                        Auto-fill 123456
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Enter 6-Digit Email OTP</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {showFarmerEmailOtp ? 'Visible' : 'Hidden (Protected)'}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type={showFarmerEmailOtp ? 'text' : 'password'}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="one-time-code"
                          maxLength={6}
                          autoFocus
                          required
                          placeholder="••••••"
                          value={farmerEmailOtp}
                          onChange={(e) => setFarmerEmailOtp(e.target.value.replace(/\D/g, ''))}
                          className={`w-full pl-10 pr-10 py-2.5 text-center tracking-[0.5em] bg-white border border-slate-200 rounded-lg font-mono text-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs transition-colors ${
                            showFarmerEmailOtp ? 'otp-unmasked' : 'otp-masked'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowFarmerEmailOtp(!showFarmerEmailOtp)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors focus:outline-none"
                          title={showFarmerEmailOtp ? 'Hide OTP (dots)' : 'Show OTP'}
                          aria-label={showFarmerEmailOtp ? 'Hide OTP' : 'Show OTP'}
                        >
                          {showFarmerEmailOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tip: You can enter the 6-digit OTP, click <strong>Auto-fill 123456</strong>, or click the login link in your email to sign in directly!
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => setFarmerEmailOtpStep(false)}
                        className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Change Email</span>
                      </button>

                      {farmerEmailCountdown > 0 ? (
                        <span className="text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>Resend in {farmerEmailCountdown}s</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleFarmerSendEmailOtp()}
                          className="text-emerald-700 font-semibold hover:underline"
                        >
                          Resend Email OTP
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || farmerEmailOtp.length < 6}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Verifying OTP with Supabase...' : 'Verify OTP & Enter Portal'}</span>
                    </button>
                  </form>
                )
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 2. MANDI OPERATOR LOGIN FORM */}
          {/* ------------------------------------------------------------- */}
          {selectedRole === 'operator' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-700" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Mandi Yard Operator Authentication
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      APMC Desk Clearance
                    </span>
                  </div>
                </div>

                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => { setMandiAuthMode('otp'); setFormError(null); }}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      mandiAuthMode === 'otp'
                        ? 'bg-purple-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Email OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMandiAuthMode('password'); setFormError(null); }}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      mandiAuthMode === 'password'
                        ? 'bg-purple-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Password
                  </button>
                </div>
              </div>

              {mandiAuthMode === 'otp' ? (
                !mandiOtpStep ? (
                  <form onSubmit={handleMandiSendOtp} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Official APMC Email ID
                      </label>
                      <input
                        type="email"
                        required
                        value={mandiEmail}
                        onChange={(e) => setMandiEmail(e.target.value)}
                        placeholder="operator@apmc.gov.in"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        A 6-digit login OTP will be delivered directly to your official email.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !mandiEmail.includes('@')}
                      className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{isSubmitting ? 'Sending OTP...' : 'Send OTP to Email'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleMandiVerifyOtp} className="space-y-4 text-xs animate-fade-in">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">Email OTP Dispatched</span>
                        <span className="font-mono text-slate-600">{mandiEmail}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Please enter the 6-digit code received on your email.
                      </p>
                    </div>

                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900 animate-fade-in">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>
                          <strong>Demo Sandbox:</strong> Test OTP is{' '}
                          <code className="font-mono font-bold bg-amber-100 text-amber-800 px-1 py-0.5 rounded border border-amber-200">
                            123456
                          </code>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMandiOtp('123456')}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] transition-colors shadow-2xs"
                      >
                        Auto-fill 123456
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Enter 6-Digit Email OTP</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {showMandiOtp ? 'Visible' : 'Hidden (Protected)'}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type={showMandiOtp ? 'text' : 'password'}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="one-time-code"
                          maxLength={6}
                          autoFocus
                          required
                          placeholder="••••••"
                          value={mandiOtp}
                          onChange={(e) => setMandiOtp(e.target.value.replace(/\D/g, ''))}
                          className={`w-full pl-10 pr-10 py-2.5 text-center tracking-[0.5em] bg-white border border-slate-200 rounded-lg font-mono text-lg font-bold text-slate-900 focus:outline-none focus:border-purple-600 shadow-2xs transition-colors ${
                            showMandiOtp ? 'otp-unmasked' : 'otp-masked'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowMandiOtp(!showMandiOtp)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors focus:outline-none"
                          title={showMandiOtp ? 'Hide OTP (dots)' : 'Show OTP'}
                          aria-label={showMandiOtp ? 'Hide OTP' : 'Show OTP'}
                        >
                          {showMandiOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tip: Enter the code from email, click <strong>Auto-fill 123456</strong>, or click the email link directly.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || mandiOtp.length < 6}
                      className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Verifying...' : 'Verify OTP & Enter APMC Desk'}</span>
                    </button>
                  </form>
                )
              ) : (
                <form onSubmit={handleMandiPasswordSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official APMC Email ID
                    </label>
                    <input
                      type="email"
                      required
                      value={mandiEmail}
                      onChange={(e) => setMandiEmail(e.target.value)}
                      placeholder="mandi.karnal@agrisync.gov.in"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Security Password
                    </label>
                    <div className="relative">
                      <input
                        type={showMandiPassword ? 'text' : 'password'}
                        required
                        value={mandiPassword}
                        onChange={(e) => setMandiPassword(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMandiPassword(!showMandiPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded focus:outline-none"
                        title={showMandiPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showMandiPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Mandi Command Desk'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 3. STATE ADMIN LOGIN FORM */}
          {/* ------------------------------------------------------------- */}
          {selectedRole === 'admin' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-slate-900" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      State Government Admin Authorization
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Level 1 State Directorate
                    </span>
                  </div>
                </div>

                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => { setAdminAuthMode('otp'); setFormError(null); }}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      adminAuthMode === 'otp'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Email OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAdminAuthMode('password'); setFormError(null); }}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      adminAuthMode === 'password'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Password
                  </button>
                </div>
              </div>

              {adminAuthMode === 'otp' ? (
                !adminOtpStep ? (
                  <form onSubmit={handleAdminSendOtp} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Directorate Email ID
                      </label>
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="director.sharma@agrisync.gov.in"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        A 6-digit login OTP will be delivered directly to this official email.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !adminEmail.includes('@')}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{isSubmitting ? 'Sending OTP...' : 'Send OTP to Email'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleAdminVerifyOtp} className="space-y-4 text-xs animate-fade-in">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">Email OTP Dispatched</span>
                        <span className="font-mono text-slate-600">{adminEmail}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Please enter the 6-digit code received on your email.
                      </p>
                    </div>

                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900 animate-fade-in">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>
                          <strong>Demo Sandbox:</strong> Test OTP is{' '}
                          <code className="font-mono font-bold bg-amber-100 text-amber-800 px-1 py-0.5 rounded border border-amber-200">
                            123456
                          </code>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdminOtp('123456')}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] transition-colors shadow-2xs"
                      >
                        Auto-fill 123456
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Enter 6-Digit Email OTP</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {showAdminOtp ? 'Visible' : 'Hidden (Protected)'}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type={showAdminOtp ? 'text' : 'password'}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="one-time-code"
                          maxLength={6}
                          autoFocus
                          required
                          placeholder="••••••"
                          value={adminOtp}
                          onChange={(e) => setAdminOtp(e.target.value.replace(/\D/g, ''))}
                          className={`w-full pl-10 pr-10 py-2.5 text-center tracking-[0.5em] bg-white border border-slate-200 rounded-lg font-mono text-lg font-bold text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors ${
                            showAdminOtp ? 'otp-unmasked' : 'otp-masked'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminOtp(!showAdminOtp)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors focus:outline-none"
                          title={showAdminOtp ? 'Hide OTP (dots)' : 'Show OTP'}
                          aria-label={showAdminOtp ? 'Hide OTP' : 'Show OTP'}
                        >
                          {showAdminOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tip: Enter the code from email, click <strong>Auto-fill 123456</strong>, or click the email link directly.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || adminOtp.length < 6}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Verifying...' : 'Verify OTP & Enter State Directorate'}</span>
                    </button>
                  </form>
                )
              ) : (
                <form onSubmit={handleAdminPasswordSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official Directorate Email ID
                    </label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="director.sharma@agrisync.gov.in"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Department Security Key
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded focus:outline-none"
                        title={showAdminPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Authenticate as State Director'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
