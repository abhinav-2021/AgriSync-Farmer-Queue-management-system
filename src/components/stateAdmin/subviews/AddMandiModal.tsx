import React, { useState, useEffect } from 'react';
import { useQueue } from '../../../context/QueueContext';
import { X, Building2, KeyRound, Copy, Check, RefreshCw, ShieldCheck } from 'lucide-react';
import type { MandiCenter } from '../../../types';

interface AddMandiModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultState?: string;
}

export const AddMandiModal: React.FC<AddMandiModalProps> = ({
  isOpen,
  onClose,
  defaultState = 'Haryana'
}) => {
  const { addMandi } = useQueue();

  const [name, setName] = useState('');
  const [state, setState] = useState(defaultState === 'all' ? 'Haryana' : defaultState);
  const [district, setDistrict] = useState('');
  const [headOperator, setHeadOperator] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [dailyCapacity, setDailyCapacity] = useState('20000');
  const [activeCounters, setActiveCounters] = useState('4');

  // Credentials
  const [officialEmail, setOfficialEmail] = useState('');
  const [accessPassword, setAccessPassword] = useState('');
  const [copied, setCopied] = useState(false);

  // Success state view
  const [createdMandi, setCreatedMandi] = useState<MandiCenter | null>(null);

  // Update suggested credentials when district/name changes
  useEffect(() => {
    const slug = (district || name).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanWord = (district || name).replace(/[^a-zA-Z]/g, '') || 'Mandi';
    if (!createdMandi) {
      if (slug) {
        setOfficialEmail(`mandi.${slug}@agrisync.gov.in`);
        setAccessPassword(`${cleanWord}@2026`);
      } else {
        setOfficialEmail('');
        setAccessPassword('');
      }
    }
  }, [district, name, createdMandi]);

  const generateRandomPassword = () => {
    const cleanWord = (district || name).replace(/[^a-zA-Z]/g, '') || 'APMC';
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    setAccessPassword(`${cleanWord}#${randDigits}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !district.trim()) return;

    const newMandi = addMandi({
      name: name.trim(),
      district: district.trim(),
      state: state,
      headOperator: headOperator.trim() || 'Assigned Officer',
      contactPhone: contactPhone.trim() || '9876543210',
      dailyCapacity: Number(dailyCapacity) || 20000,
      activeCounters: Number(activeCounters) || 4,
      officialEmail: officialEmail.trim(),
      accessPassword: accessPassword.trim()
    });

    setCreatedMandi(newMandi);
  };

  const handleCopyCredentials = () => {
    if (!createdMandi) return;
    const text = `APMC Mandi: ${createdMandi.name} (${createdMandi.district}, ${createdMandi.state})\nOfficial Login Email: ${createdMandi.officialEmail}\nAccess Password: ${createdMandi.accessPassword}\nPortal: AgriSync Mandi Clearance Desk`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    setCreatedMandi(null);
    setName('');
    setDistrict('');
    setHeadOperator('');
    setContactPhone('');
    setOfficialEmail('');
    setAccessPassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {createdMandi ? 'Mandi Registered & Credentials Issued' : 'Register New APMC Mandi Centre'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {createdMandi ? 'Login credentials generated for operator' : 'Configure procurement facility and provision operator access'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!createdMandi ? (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Facility Details */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <span>1. Mandi Facility Details</span>
              </h4>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Mandi Centre Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Panipat APMC Grain Market"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    State <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800 bg-white"
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
                    District <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Panipat"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Daily Capacity (Quintals)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    placeholder="20000"
                    value={dailyCapacity}
                    onChange={(e) => setDailyCapacity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Active Weighbridge Counters
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={activeCounters}
                    onChange={(e) => setActiveCounters(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Operator & Credential Provisioning */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <KeyRound className="w-3.5 h-3.5 text-purple-700" />
                <span>2. Operator Credentials & Station Staff</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Head Operator / Superintendent
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. R. K. Sharma (Inspector)"
                    value={headOperator}
                    onChange={(e) => setHeadOperator(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Generated Login Credentials Box */}
              <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-purple-950">
                      Official Operator Login Email
                    </label>
                    <span className="text-[10px] text-purple-700 font-medium">Auto-generated</span>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="mandi.panipat@agrisync.gov.in"
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded text-slate-900 font-mono text-[11px] focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-purple-950">
                      Initial Access Password
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-[10px] text-purple-700 hover:text-purple-900 font-medium flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Panipat@2026"
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded text-slate-900 font-mono font-bold text-[11px] focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim() || !district.trim()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Register Mandi & Issue Credentials</span>
              </button>
            </div>

          </form>
        ) : (
          /* SUCCESS SLIP: Show Issued Credentials */
          <div className="p-6 space-y-5 animate-fade-in text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Check className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">
                {createdMandi.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Successfully enrolled in {createdMandi.district} District, {createdMandi.state}
              </p>
            </div>

            {/* Credential Slip Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold font-sans">
                  Official Operator Credentials
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded font-sans">
                  Active
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">APMC Login Email:</span>
                <span className="text-xs font-bold text-slate-900 select-all">
                  {createdMandi.officialEmail}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">Security Password:</span>
                <span className="text-xs font-bold text-purple-700 select-all">
                  {createdMandi.accessPassword}
                </span>
              </div>

              <div className="pt-1 text-[11px] text-slate-500 font-sans">
                Station Superintendent: <strong>{createdMandi.headOperator}</strong>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Credentials Copied to Clipboard!' : 'Copy Operator Credentials'}</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
              >
                Done & Return to Directory
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
