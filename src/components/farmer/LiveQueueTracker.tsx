import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueue } from '../../context/QueueContext';
import { CROPS } from '../../lib/mockData';
import { AgriSyncLogo } from '../common/AgriSyncLogo';
import {
  CheckCircle,
  QrCode,
  Building,
  FileCheck,
  Scale,
  CreditCard,
  X,
  MapPin
} from 'lucide-react';

export const LiveQueueTracker: React.FC = () => {
  const { t } = useTranslation(['farmer', 'common']);
  const { bookings, currentFarmer, activeCalledToken, isRealtimeConnected } = useQueue();
  const [showQrModal, setShowQrModal] = useState(false);

  // Find the primary active booking for the logged-in farmer
  const farmerBookings = bookings.filter((b) => b.farmer_phone === currentFarmer?.phone);
  const activeBooking = farmerBookings[0] || bookings[0];

  if (!activeBooking) {
    return null;
  }

  // Calculate position ahead
  const allWaiting = bookings.filter((b) => b.status === 'registered');
  const myIndex = allWaiting.findIndex((b) => b.id === activeBooking.id);
  const vehiclesAhead = myIndex >= 0 ? myIndex : 0;
  const estimatedWaitMins = (vehiclesAhead + 1) * 15;

  const isMyTokenCalled = activeCalledToken === activeBooking.token_number;

  // Stages configuration
  const stages = [
    { id: 'registered', label: t('common:stages.registered', 'Registered'), icon: <FileCheck className="w-3.5 h-3.5" /> },
    { id: 'verified', label: t('common:stages.verified', 'Quality Verified'), icon: <Building className="w-3.5 h-3.5" /> },
    { id: 'weighed', label: t('common:stages.weighed', 'Weighed'), icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'paid', label: t('common:stages.paid', 'Paid & Dispatched'), icon: <CreditCard className="w-3.5 h-3.5" /> },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'registered': return 1;
      case 'verified': return 2;
      case 'weighed': return 3;
      case 'paid':
      case 'completed': return 4;
      default: return 1;
    }
  };

  const currentStageIndex = getStageIndex(activeBooking.status);

  // MSP details
  const cropInfo = CROPS.find((c) => c.name === activeBooking.crop_type) || CROPS[0];
  const totalValue = (activeBooking.actual_weight_quintals || activeBooking.estimated_quintals) * cropInfo.msp;

  return (
    <div className="space-y-4">

      {/* 1. Active Call Alert Banner (Only when called) */}
      {isMyTokenCalled && (
        <div className="bg-amber-500 text-slate-950 p-4 rounded-lg flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-slate-950 animate-ping flex-shrink-0" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wider">
                🚨 Alert: Your Token Has Been Called!
              </p>
              <p className="text-xs font-medium">
                Proceed with vehicle <strong>{activeBooking.vehicle_number}</strong> to{' '}
                <strong>{activeBooking.counter_assigned || 'Gate Entry 1'}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowQrModal(true)}
            className="px-3 py-1.5 bg-slate-950 text-white rounded-md text-xs font-semibold hover:bg-slate-900 transition-colors shadow-xs flex-shrink-0"
          >
            Show Gate Pass
          </button>
        </div>
      )}

      {/* 2. Main Token Status Hero Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-medium text-slate-500">
                {t('yourToken', 'Your Token Number')}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                <span className={`w-1.5 h-1.5 rounded-full ${isRealtimeConnected ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`}></span>
                {t('common:status.connected', 'Live Sync')}
              </span>
              {activeBooking.mandi_name && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  <span>{activeBooking.mandi_name}</span>
                  {activeBooking.state && <span className="text-slate-400">({activeBooking.state})</span>}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                #{activeBooking.token_number}
              </span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {activeBooking.slot_time}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 sm:pt-0">
            <div>
              <span className="text-slate-400 block text-[11px]">{t('vehiclesAhead', 'Vehicles Ahead')}</span>
              <span className="font-semibold text-slate-800">
                {activeBooking.status === 'paid' ? t('common:stages.completed', 'Completed') : `${vehiclesAhead} ${t('common:units.vehicles', 'vehicles')} ahead`}
              </span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-400 block text-[11px]">{t('estimatedWait', 'Est. Wait')}</span>
              <span className="font-semibold text-slate-800 font-mono-num">
                {activeBooking.status === 'paid' ? `0 ${t('common:units.minutes', 'min')}` : `~${estimatedWaitMins} ${t('common:units.minutes', 'min')}`}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Simple Thin Progress Timeline */}
        <div className="py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-700">Procurement Progress</span>
            <span className="text-xs text-slate-400 font-mono">Stage {Math.min(4, currentStageIndex)} of 4</span>
          </div>

          {/* Stepper with thin line */}
          <div className="grid grid-cols-4 gap-2 relative">
            {stages.map((stage, idx) => {
              const stageNum = idx + 1;
              const isPast = currentStageIndex > stageNum;
              const isCurrent = currentStageIndex === stageNum;

              return (
                <div key={stage.id} className="flex flex-col items-center text-center">
                  {/* Step Circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors z-10 ${
                      isPast
                        ? 'bg-emerald-700 text-white'
                        : isCurrent
                        ? 'bg-emerald-700 text-white ring-4 ring-emerald-50'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isPast ? <CheckCircle className="w-4 h-4" /> : stageNum}
                  </div>

                  {/* Stage Label */}
                  <span
                    className={`text-[11px] mt-2 font-medium leading-tight ${
                      isCurrent
                        ? 'text-slate-900 font-semibold'
                        : isPast
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Timestamp notes */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
            <span>
              Registered:{' '}
              <strong className="text-slate-600 font-mono">
                {activeBooking.stage_timestamps.registered_at || '10:02 AM'}
              </strong>
            </span>
            {activeBooking.stage_timestamps.verified_at && (
              <span>
                Verified:{' '}
                <strong className="text-slate-600 font-mono">
                  {activeBooking.stage_timestamps.verified_at}
                </strong>
              </span>
            )}
            {activeBooking.stage_timestamps.paid_at && (
              <span>
                Paid:{' '}
                <strong className="text-slate-600 font-mono">
                  {activeBooking.stage_timestamps.paid_at}
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* 4. Compact Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          
          <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block">Crop</span>
            <span className="text-xs font-semibold text-slate-900 block mt-0.5">
              {activeBooking.crop_type.split(' ')[0]}
            </span>
          </div>

          <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block">Vehicle</span>
            <span className="text-xs font-mono font-semibold text-slate-900 block mt-0.5">
              {activeBooking.vehicle_number}
            </span>
          </div>

          <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block">Load (Estimated)</span>
            <span className="text-xs font-mono font-semibold text-slate-900 block mt-0.5">
              {activeBooking.actual_weight_quintals || activeBooking.estimated_quintals} Qtl
            </span>
          </div>

          <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block">Govt MSP Value</span>
            <span className="text-xs font-mono font-semibold text-emerald-800 block mt-0.5">
              ₹{totalValue.toLocaleString('en-IN')}
            </span>
          </div>

        </div>

        {/* Action button */}
        <div className="mt-5 flex items-center justify-end">
          <button
            onClick={() => setShowQrModal(true)}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Digital Gate Pass</span>
          </button>
        </div>

      </div>

      {/* QR Gate Pass Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xs w-full p-5 border border-slate-200 text-center shadow-xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <AgriSyncLogo size="sm" />
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-bold text-slate-900 mb-2">APMC Electronic Gate Pass</p>

            {/* Clean QR code */}
            <div className="w-44 h-44 mx-auto bg-slate-900 p-3 rounded-lg flex items-center justify-center mb-3">
              <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-white rounded">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      (i % 2 === 0 || i % 5 === 0 || i < 6 || i > 29)
                        ? 'bg-slate-900'
                        : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-xs space-y-1 text-left bg-slate-50 p-2.5 rounded border border-slate-200 mb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Token:</span>
                <span className="font-mono font-bold text-slate-900">#{activeBooking.token_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Farmer:</span>
                <span className="text-slate-800 font-medium">{activeBooking.farmer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-mono text-slate-800">{activeBooking.vehicle_number}</span>
              </div>
              {activeBooking.mandi_name && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Center:</span>
                  <span className="text-slate-800 font-medium truncate max-w-[170px]">{activeBooking.mandi_name}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
