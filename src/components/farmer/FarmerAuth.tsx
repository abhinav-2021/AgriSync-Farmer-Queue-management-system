import React, { useState, useEffect } from 'react';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { AgriSyncLogo } from '../common/AgriSyncLogo';
import {
  ShieldCheck,
  AlertCircle,
  Phone,
  Mail,
  RotateCcw,
  CheckCircle2,
  Clock,
  Send,
  Sparkles
} from 'lucide-react';

export const FarmerAuth: React.FC = () => {
  const { loginFarmer, triggerToast } = useQueue();
  const { sendPhoneOtp, verifyPhoneOtp, sendEmailOtp, verifyEmailOtp } = useAuth();

  const [authType, setAuthType] = useState<'phone' | 'email'>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Common Farmer Profile inputs
  const [fullName, setFullName] = useState('');
  const [farmerState, setFarmerState] = useState('Haryana');
  const [village, setVillage] = useState('');

  // Phone OTP states
  const [phone, setPhone] = useState('');
  const [phoneOtpStep, setPhoneOtpStep] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneCountdown, setPhoneCountdown] = useState(0);
  const [phoneIsSandbox, setPhoneIsSandbox] = useState(false);

  // Email OTP states
  const [email, setEmail] = useState('');
  const [emailOtpStep, setEmailOtpStep] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailCountdown, setEmailCountdown] = useState(0);

  // Countdown timer for Phone OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (phoneCountdown > 0) {
      timer = setTimeout(() => setPhoneCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [phoneCountdown]);

  // Countdown timer for Email OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (emailCountdown > 0) {
      timer = setTimeout(() => setEmailCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [emailCountdown]);

  const switchTab = (type: 'phone' | 'email') => {
    setAuthType(type);
    setErrorMessage(null);
    setSuccessInfo(null);
  };

  // -------------------------------------------------------------
  // PHONE OTP HANDLERS
  // -------------------------------------------------------------
  const handleSendPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    const clean = phone.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name as per Kisan/Aadhaar record.');
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await sendPhoneOtp(clean, {
      full_name: fullName.trim(),
      state: farmerState,
      village: village.trim()
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(
        `${error.message || 'Failed to dispatch SMS'}. Tip: If phone provider is not configured in Supabase, you can use the Email OTP tab to verify via Supabase immediately.`
      );
      return;
    }

    setPhoneOtp('');
    setPhoneOtpStep(true);
    setPhoneCountdown(60);

    if (data?.mockSandbox) {
      setPhoneIsSandbox(true);
      setSuccessInfo('Test OTP Sandbox: Verification code is 123456. Click "Auto-fill 123456" below or enter 123456.');
      triggerToast({
        title: 'SMS Sandbox Mode',
        message: 'Phone gateway unconfigured. Use Demo OTP: 123456',
        type: 'info'
      });
    } else {
      setPhoneIsSandbox(false);
      setSuccessInfo(`OTP sent via SMS to +91 ${clean}. Please check your phone.`);
      triggerToast({
        title: 'SMS Dispatched',
        message: `Verification code sent to +91 ${clean}.`,
        type: 'info'
      });
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!phoneOtp || phoneOtp.trim().length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code received on your mobile.');
      return;
    }

    setIsSubmitting(true);
    const clean = phone.replace(/\D/g, '');
    const { error } = await verifyPhoneOtp(clean, phoneOtp, {
      full_name: fullName.trim(),
      state: farmerState,
      village: village.trim()
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message || 'Invalid or expired OTP. Please try again.');
      return;
    }

    // Sync farmer into QueueContext
    loginFarmer(clean, fullName.trim(), village.trim() || 'Agricultural Region', farmerState);
    triggerToast({
      title: 'Mobile Verified Successfully',
      message: `Welcome, ${fullName.trim()}! Digital slot booking active.`,
      type: 'success'
    });
  };

  // -------------------------------------------------------------
  // EMAIL OTP HANDLERS
  // -------------------------------------------------------------
  const handleSendEmailOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name as per Kisan/Aadhaar record.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await sendEmailOtp(cleanEmail, {
      full_name: fullName.trim(),
      role: 'farmer',
      state: farmerState,
      phone: phone.replace(/\D/g, '')
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message || 'Failed to dispatch email OTP. Please check your Supabase project settings.');
      return;
    }

    setEmailOtp('');
    setEmailOtpStep(true);
    setEmailCountdown(60);
    setSuccessInfo(
      `Verification dispatched to ${cleanEmail}. Enter the 6-digit OTP, use test code 123456, or click the login link in your email.`
    );
    triggerToast({
      title: 'Email Verification Dispatched',
      message: `OTP sent to ${cleanEmail}. Test OTP 123456 is also active.`,
      type: 'info'
    });
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!emailOtp || emailOtp.trim().length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await verifyEmailOtp(cleanEmail, emailOtp, {
      full_name: fullName.trim(),
      role: 'farmer',
      state: farmerState,
      phone: phone.replace(/\D/g, '')
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message || 'Invalid or expired email OTP. Please check your inbox.');
      return;
    }

    const assignedPhone = phone.replace(/\D/g, '') || cleanEmail.split('@')[0];
    loginFarmer(assignedPhone, fullName.trim(), village.trim() || 'Agricultural Region', farmerState);
    triggerToast({
      title: 'Email Verified Successfully',
      message: `Welcome, ${fullName.trim()}! Digital slot booking active.`,
      type: 'success'
    });
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 sm:py-10">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex justify-center mb-3">
            <AgriSyncLogo size="lg" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Secure Supabase Authentication</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Farmer Sign In & Verification
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authenticate via Mobile OTP or Email OTP to manage your delivery slots
          </p>
        </div>

        {/* Method Switcher Tabs */}
        <div className="flex border-b border-slate-200 mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => switchTab('phone')}
            className={`flex-1 pb-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              authType === 'phone'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile OTP (SMS)</span>
          </button>
          <button
            type="button"
            onClick={() => switchTab('email')}
            className={`flex-1 pb-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              authType === 'email'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email OTP (Inbox)</span>
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {successInfo && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">{successInfo}</div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 1. MOBILE PHONE OTP FORM */}
        {/* ------------------------------------------------------------- */}
        {authType === 'phone' && (
          !phoneOtpStep ? (
            <form onSubmit={handleSendPhoneOtp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Farmer Full Name <span className="text-emerald-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  10-Digit Mobile Number <span className="text-emerald-700">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-medium text-xs font-mono">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  A 6-digit verification code will be sent to this number via SMS.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    State <span className="text-emerald-700">*</span>
                  </label>
                  <select
                    value={farmerState}
                    onChange={(e) => setFarmerState(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="Haryana">Haryana</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Village / Mandi Block
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sihora / Panagar"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || phone.replace(/\D/g, '').length !== 10 || !fullName.trim()}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{isSubmitting ? 'Sending SMS to Mobile...' : 'Send OTP on Mobile'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 text-xs animate-fade-in">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">SMS Verification Dispatched</span>
                  <span className="font-mono text-slate-600 font-medium">+91 {phone}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Please enter the 6-digit OTP code received on your mobile phone via SMS.
                </p>
              </div>

              {phoneIsSandbox && (
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
                    onClick={() => setPhoneOtp('123456')}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] transition-colors shadow-2xs"
                  >
                    Auto-fill 123456
                  </button>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  placeholder="------"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 text-center tracking-[0.5em] border border-slate-200 rounded-md font-mono text-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setPhoneOtpStep(false)}
                  className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Change Mobile Number</span>
                </button>

                {phoneCountdown > 0 ? (
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>Resend in {phoneCountdown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendPhoneOtp()}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    Resend SMS Code
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || phoneOtp.length < 6}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Verifying OTP with Supabase...' : 'Verify OTP & Enter Portal'}</span>
              </button>
            </form>
          )
        )}

        {/* ------------------------------------------------------------- */}
        {/* 2. EMAIL OTP FORM */}
        {/* ------------------------------------------------------------- */}
        {authType === 'email' && (
          !emailOtpStep ? (
            <form onSubmit={handleSendEmailOtp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Farmer Full Name <span className="text-emerald-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Email Address <span className="text-emerald-700">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  A 6-digit login OTP will be delivered directly to this email inbox.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    State <span className="text-emerald-700">*</span>
                  </label>
                  <select
                    value={farmerState}
                    onChange={(e) => setFarmerState(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="Haryana">Haryana</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email.includes('@') || !fullName.trim()}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{isSubmitting ? 'Sending OTP to Email...' : 'Send OTP to Email'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyEmailOtp} className="space-y-4 text-xs animate-fade-in">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Email OTP Dispatched</span>
                  <span className="font-mono text-slate-600 font-medium truncate max-w-[180px]">{email}</span>
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
                  onClick={() => setEmailOtp('123456')}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] transition-colors shadow-2xs"
                >
                  Auto-fill 123456
                </button>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Enter 6-Digit Email OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  placeholder="------"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 text-center tracking-[0.5em] border border-slate-200 rounded-md font-mono text-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: Enter the 6-digit code sent to your email, or use test OTP <strong>123456</strong>. If your email has a login button, clicking it will also log you in directly!
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setEmailOtpStep(false)}
                  className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Change Email</span>
                </button>

                {emailCountdown > 0 ? (
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>Resend in {emailCountdown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendEmailOtp()}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    Resend Email OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || emailOtp.length < 6}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Verifying OTP with Supabase...' : 'Verify Email OTP & Enter Portal'}</span>
              </button>
            </form>
          )
        )}

      </div>
    </div>
  );
};
