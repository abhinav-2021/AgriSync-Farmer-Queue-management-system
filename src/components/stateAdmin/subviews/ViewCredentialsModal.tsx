import React, { useState } from 'react';
import { X, KeyRound, Copy, Check, ShieldCheck, Building2 } from 'lucide-react';
import type { MandiCenter } from '../../../types';

interface ViewCredentialsModalProps {
  mandi: MandiCenter | null;
  onClose: () => void;
}

export const ViewCredentialsModal: React.FC<ViewCredentialsModalProps> = ({ mandi, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!mandi) return null;

  const email = mandi.officialEmail || `mandi.${mandi.district.toLowerCase().replace(/[^a-z0-9]/g, '')}@agrisync.gov.in`;
  const password = mandi.accessPassword || `${mandi.district.replace(/[^a-zA-Z]/g, '') || 'Mandi'}@2026`;

  const handleCopy = () => {
    const text = `APMC Mandi: ${mandi.name} (${mandi.district}, ${mandi.state})\nOfficial Login Email: ${email}\nAccess Password: ${password}\nPortal: AgriSync Mandi Clearance Desk`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-xs text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Mandi Operator Credentials
              </h3>
              <p className="text-[11px] text-slate-400">
                Official APMC access keys for {mandi.district} Division
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 text-xs truncate">{mandi.name}</h4>
              <p className="text-[11px] text-slate-500">{mandi.district} District, {mandi.state}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              Active Facility
            </span>
          </div>

          {/* Credential Slip Card */}
          <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-purple-200/80">
              <span className="text-[10px] uppercase tracking-wider text-purple-800 font-semibold font-sans">
                Station Clearance Keys
              </span>
              <span className="text-[10px] text-purple-700 font-medium font-sans flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-600" />
                Verified
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Official APMC Login Email:</span>
              <span className="text-xs font-bold text-slate-900 select-all block mt-0.5">
                {email}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Security Access Password:</span>
              <span className="text-xs font-bold text-purple-700 select-all block mt-0.5">
                {password}
              </span>
            </div>

            <div className="pt-2 border-t border-purple-200/60 text-[11px] text-slate-600 font-sans flex items-center justify-between">
              <span>Superintendent:</span>
              <strong className="text-slate-800">{mandi.headOperator}</strong>
            </div>

            {mandi.contactPhone && (
              <div className="text-[11px] text-slate-600 font-sans flex items-center justify-between">
                <span>Contact Phone:</span>
                <span className="font-mono text-slate-800">+91 {mandi.contactPhone}</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            These credentials grant access to the <strong>APMC Mandi Clearance Desk</strong> on the login portal. Operators can use this email and password or receive an OTP.
          </p>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-purple-200" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Credentials Copied!' : 'Copy Operator Credentials'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
