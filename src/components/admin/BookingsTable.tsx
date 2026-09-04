import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import type { Booking, QueueStage } from '../../types';
import { BookingDetailModal } from './BookingDetailModal';
import { Search, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';

export const BookingsTable: React.FC = () => {
  const {
    bookings,
    updateBookingStage,
    activeCalledToken,
    isLoading,
    fetchQueueData
  } = useQueue();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.token_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.farmer_phone.includes(searchQuery) ||
      b.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.crop_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = stageFilter === 'all' || b.status === stageFilter;

    return matchesSearch && matchesStage;
  });

  const handleStageAdvance = (e: React.MouseEvent, booking: Booking) => {
    e.stopPropagation();

    let nextStage: QueueStage | null = null;
    let extras: Partial<Booking> = {};

    if (booking.status === 'registered') {
      nextStage = 'verified';
      extras.moisture_percentage = Number((10 + Math.random() * 2.5).toFixed(1));
    } else if (booking.status === 'verified') {
      nextStage = 'weighed';
      extras.actual_weight_quintals = booking.estimated_quintals;
    } else if (booking.status === 'weighed') {
      nextStage = 'paid';
      const weight = booking.actual_weight_quintals || booking.estimated_quintals;
      const rate = booking.msp_rate_per_quintal || 2275;
      extras.total_payout = Math.round(weight * rate);
    }

    if (nextStage) {
      updateBookingStage(booking.id, nextStage, extras);
    }
  };

  const getStageIndicator = (status: QueueStage) => {
    switch (status) {
      case 'registered':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Registered
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Quality Verified
          </span>
        );
      case 'weighed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Weighed
          </span>
        );
      case 'paid':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Paid & Dispatched
          </span>
        );
      default:
        return (
          <span className="text-xs text-slate-500 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      
      {/* Table Toolbar: Search, Filters & Sync Refresh */}
      <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="admin-search-input"
            type="text"
            placeholder="Search token, farmer, phone, or vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400"
          />
        </div>

        {/* Minimal Filters + Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            {['all', 'registered', 'verified', 'weighed', 'paid'].map((stageKey) => (
              <button
                key={stageKey}
                onClick={() => setStageFilter(stageKey)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                  stageFilter === stageKey
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {stageKey === 'all' ? 'All' : stageKey}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchQueueData()}
            title="Refresh from Supabase"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4 font-medium">Token</th>
              <th className="py-2.5 px-4 font-medium">Farmer</th>
              <th className="py-2.5 px-4 font-medium">Crop / Load</th>
              <th className="py-2.5 px-4 font-medium">Slot</th>
              <th className="py-2.5 px-4 font-medium">Vehicle</th>
              <th className="py-2.5 px-4 font-medium">Stage</th>
              <th className="py-2.5 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                    <span>Synchronizing with live queue...</span>
                  </div>
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  No bookings found for the selected query.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => {
                const isCurrentActive = booking.token_number === activeCalledToken;

                return (
                  <tr
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${
                      isCurrentActive ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    {/* Token */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        #{booking.token_number}
                      </span>
                    </td>

                    {/* Farmer */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-slate-900 block">{booking.farmer_name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">+91 {booking.farmer_phone}</span>
                      </div>
                    </td>

                    {/* Crop / Weight */}
                    <td className="py-3 px-4">
                      <span className="text-slate-800 font-medium">{booking.crop_type.split(' ')[0]}</span>
                      <span className="text-slate-400 ml-1 font-mono">
                        ({booking.actual_weight_quintals || booking.estimated_quintals} Qtl)
                      </span>
                    </td>

                    {/* Slot Time */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600">
                      {booking.slot_time}
                    </td>

                    {/* Vehicle */}
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {booking.vehicle_number}
                    </td>

                    {/* Stage status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStageIndicator(booking.status)}
                    </td>

                    {/* Contextual Action Button */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {booking.status === 'registered' && (
                          <button
                            onClick={(e) => handleStageAdvance(e, booking)}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded font-medium text-[11px] transition-colors"
                          >
                            Verify Lab
                          </button>
                        )}

                        {booking.status === 'verified' && (
                          <button
                            onClick={(e) => handleStageAdvance(e, booking)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded font-medium text-[11px] transition-colors"
                          >
                            Weigh
                          </button>
                        )}

                        {booking.status === 'weighed' && (
                          <button
                            onClick={(e) => handleStageAdvance(e, booking)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-medium text-[11px] transition-colors"
                          >
                            Pay DBT
                          </button>
                        )}

                        {booking.status === 'paid' && (
                          <span className="text-[11px] text-slate-400 font-mono px-2 py-0.5">
                            Done ✓
                          </span>
                        )}

                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="View detailed audit record"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="md:hidden divide-y divide-slate-200">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No bookings found.
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="p-4 space-y-3 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    #{booking.token_number}
                  </span>
                  <span className="font-semibold text-xs text-slate-900">{booking.farmer_name}</span>
                </div>
                {getStageIndicator(booking.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Crop & Load</span>
                  <span>{booking.crop_type.split(' ')[0]} ({booking.estimated_quintals} Qtl)</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Vehicle</span>
                  <span>{booking.vehicle_number}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-mono">
                  {booking.slot_time}
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {booking.status === 'registered' && (
                    <button
                      onClick={(e) => handleStageAdvance(e, booking)}
                      className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded font-medium text-xs"
                    >
                      Verify Lab
                    </button>
                  )}
                  {booking.status === 'verified' && (
                    <button
                      onClick={(e) => handleStageAdvance(e, booking)}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-medium text-xs"
                    >
                      Weigh
                    </button>
                  )}
                  {booking.status === 'weighed' && (
                    <button
                      onClick={(e) => handleStageAdvance(e, booking)}
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium text-xs"
                    >
                      Pay DBT
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

    </div>
  );
};
