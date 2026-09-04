import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueue } from '../../context/QueueContext';
import { FarmerAuth } from './FarmerAuth';
import { LiveQueueTracker } from './LiveQueueTracker';
import { SlotBookingModal } from './SlotBookingModal';
import { AgriSyncLogo } from '../common/AgriSyncLogo';
import { Plus, LogOut, CheckCircle } from 'lucide-react';

export const FarmerPortal: React.FC = () => {
  const { t } = useTranslation(['farmer', 'common']);
  const {
    currentFarmer,
    logoutFarmer,
    bookings
  } = useQueue();

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // If not logged in, render authentication view
  if (!currentFarmer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <FarmerAuth />
      </div>
    );
  }

  const farmerBookings = bookings.filter((b) => b.farmer_phone === currentFarmer.phone);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* 1. Clean Top Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-md bg-emerald-50/50 border border-emerald-100 flex-shrink-0">
            <AgriSyncLogo variant="icon" size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                {currentFarmer.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle className="w-3 h-3" />
                {t('verifiedFarmer', 'Verified Farmer')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              +91 {currentFarmer.phone} • {currentFarmer.village}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            id="book-new-slot-btn"
            onClick={() => setIsBookingOpen(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-md shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('bookDeliverySlot', 'Book Delivery Slot')}</span>
          </button>

          <button
            onClick={logoutFarmer}
            title={t('switchAccount', 'Switch Farmer Account')}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. Main Live Queue Tracker */}
      {farmerBookings.length > 0 ? (
        <LiveQueueTracker />
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center space-y-3">
          <h3 className="font-semibold text-sm text-slate-800">No Active Slot Booked</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Book your delivery slot in advance to receive an instant digital token and avoid waiting queues at the mandi.
          </p>
          <div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-md shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Slot Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <SlotBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

    </div>
  );
};
