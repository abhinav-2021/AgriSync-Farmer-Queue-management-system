import React from 'react';
import { useQueue } from '../../context/QueueContext';
import type { Booking, QueueStage } from '../../types';
import { X, Check } from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, onClose }) => {
  const { updateBookingStage, callNextToken } = useQueue();

  if (!booking) return null;

  const handleStageAdvance = (nextStage: QueueStage) => {
    let extras: Partial<Booking> = {};
    if (nextStage === 'verified' && !booking.moisture_percentage) {
      extras.moisture_percentage = 11.4;
    }
    if (nextStage === 'weighed' && !booking.actual_weight_quintals) {
      extras.actual_weight_quintals = booking.estimated_quintals;
    }
    if (nextStage === 'paid' && !booking.total_payout) {
      const weight = booking.actual_weight_quintals || booking.estimated_quintals;
      const rate = booking.msp_rate_per_quintal || 2275;
      extras.total_payout = Math.round(weight * rate);
    }
    updateBookingStage(booking.id, nextStage, extras);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-base text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              #{booking.token_number}
            </span>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 leading-tight">
                {booking.farmer_name}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                +91 {booking.farmer_phone} • {booking.farmer_village}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Status Bar */}
          <div className="bg-slate-50 rounded-md p-3 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Current Status</span>
            <span className="font-medium text-slate-900 uppercase tracking-wide px-2 py-0.5 rounded bg-white border border-slate-200">
              {booking.status}
            </span>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-slate-200 rounded-md">
              <span className="text-[11px] text-slate-400 block mb-0.5">Crop & Estimated Load</span>
              <span className="font-medium text-slate-900">{booking.crop_type}</span>
              <span className="text-slate-500 block font-mono">{booking.estimated_quintals} Quintals</span>
            </div>

            <div className="p-3 border border-slate-200 rounded-md">
              <span className="text-[11px] text-slate-400 block mb-0.5">Vehicle Plate & Slot</span>
              <span className="font-mono font-medium text-slate-900">{booking.vehicle_number}</span>
              <span className="text-slate-500 block">{booking.slot_time}</span>
            </div>

            <div className="p-3 border border-slate-200 rounded-md">
              <span className="text-[11px] text-slate-400 block mb-0.5">Lab Moisture / Net Weight</span>
              <span className="font-mono font-medium text-slate-900">
                {booking.moisture_percentage ? `${booking.moisture_percentage}% Moisture` : 'Pending Lab'}
              </span>
              <span className="text-slate-500 block font-mono">
                {booking.actual_weight_quintals ? `${booking.actual_weight_quintals} Qtl Actual` : 'Pending Weighbridge'}
              </span>
            </div>

            <div className="p-3 border border-slate-200 rounded-md">
              <span className="text-[11px] text-slate-400 block mb-0.5">MSP Rate & Total DBT</span>
              <span className="font-mono font-medium text-slate-900">
                ₹{booking.msp_rate_per_quintal || 2275} / Qtl
              </span>
              <span className="text-emerald-700 font-semibold block font-mono">
                {booking.total_payout ? `₹${booking.total_payout.toLocaleString('en-IN')}` : 'Pending Calculation'}
              </span>
            </div>
          </div>

          {/* Timeline Timestamps */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Procurement Audit Log
            </span>
            <div className="border border-slate-200 rounded-md divide-y divide-slate-100 text-xs">
              <div className="px-3 py-2 flex justify-between items-center">
                <span className="text-slate-600">Gate Entry (Registered)</span>
                <span className="font-mono text-slate-900">{booking.stage_timestamps.registered_at || '---'}</span>
              </div>
              <div className="px-3 py-2 flex justify-between items-center">
                <span className="text-slate-600">Quality Inspection (Verified)</span>
                <span className="font-mono text-slate-900">{booking.stage_timestamps.verified_at || '---'}</span>
              </div>
              <div className="px-3 py-2 flex justify-between items-center">
                <span className="text-slate-600">Weighbridge Measurement</span>
                <span className="font-mono text-slate-900">{booking.stage_timestamps.weighed_at || '---'}</span>
              </div>
              <div className="px-3 py-2 flex justify-between items-center">
                <span className="text-slate-600">DBT MSP Payment Disbursal</span>
                <span className="font-mono text-slate-900">{booking.stage_timestamps.paid_at || '---'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              callNextToken(booking.token_number);
              onClose();
            }}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Summon to Desk
          </button>

          <div className="flex items-center gap-2">
            {booking.status === 'registered' && (
              <button
                type="button"
                onClick={() => {
                  handleStageAdvance('verified');
                  onClose();
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Quality Verified</span>
              </button>
            )}

            {booking.status === 'verified' && (
              <button
                type="button"
                onClick={() => {
                  handleStageAdvance('weighed');
                  onClose();
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Record Weighbridge</span>
              </button>
            )}

            {booking.status === 'weighed' && (
              <button
                type="button"
                onClick={() => {
                  handleStageAdvance('paid');
                  onClose();
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Disburse DBT MSP</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
