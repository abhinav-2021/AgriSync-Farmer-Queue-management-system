import React, { useState, useEffect } from 'react';
import { useQueue } from '../../context/QueueContext';
import { AVAILABLE_TIME_SLOTS, CROPS, STATE_HIERARCHY } from '../../lib/mockData';
import type { VehicleType } from '../../types';
import {
  X,
  MapPin,
  Clock,
  ChevronDown,
  Scale,
  Calendar,
  Truck
} from 'lucide-react';

interface SlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlotBookingModal: React.FC<SlotBookingModalProps> = ({ isOpen, onClose }) => {
  const { currentFarmer, bookSlot } = useQueue();

  const today = new Date().toISOString().split('T')[0];

  // Cascading 3-Step Selection State
  const [selectedState, setSelectedState] = useState<string>(() => currentFarmer?.state || 'Madhya Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Jabalpur');
  const [selectedMandiId, setSelectedMandiId] = useState<string>('mp-jab-1');

  // Other Booking Fields
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(AVAILABLE_TIME_SLOTS[2]);
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0].name);
  const [estimatedQuintals, setEstimatedQuintals] = useState(50);
  const [vehicleType, setVehicleType] = useState<VehicleType>('Tractor-Trolley');
  const [vehicleNumber, setVehicleNumber] = useState('MP-20-EA-4512');

  // Available Districts derived from Selected State
  const activeStateData = STATE_HIERARCHY.find((s) => s.state === selectedState);
  const availableDistricts = activeStateData?.districts || [];

  // Available Mandis derived from Selected District
  const activeDistrictData = availableDistricts.find((d) => d.name === selectedDistrict);
  const availableMandis = activeDistrictData?.mandis || [];

  // Currently Selected Mandi object for live wait time display
  const selectedMandi = availableMandis.find((m) => m.id === selectedMandiId);

  // When farmer changes, adjust default state if needed
  useEffect(() => {
    if (currentFarmer?.state) {
      const stateMatch = STATE_HIERARCHY.find((s) => s.state === currentFarmer.state);
      if (stateMatch) {
        setSelectedState(stateMatch.state);
        const firstDist = stateMatch.districts[0];
        if (firstDist) {
          setSelectedDistrict(firstDist.name);
          setSelectedMandiId(firstDist.mandis[0]?.id || '');
        }
      }
    }
  }, [currentFarmer]);

  // Handle State Change
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    if (!newState) {
      setSelectedDistrict('');
      setSelectedMandiId('');
      return;
    }
    const stateMatch = STATE_HIERARCHY.find((s) => s.state === newState);
    const firstDistrict = stateMatch?.districts[0];
    if (firstDistrict) {
      setSelectedDistrict(firstDistrict.name);
      setSelectedMandiId(firstDistrict.mandis[0]?.id || '');
    } else {
      setSelectedDistrict('');
      setSelectedMandiId('');
    }

    // Set matching vehicle plate prefix
    if (newState === 'Madhya Pradesh') setVehicleNumber('MP-20-EA-4512');
    else if (newState === 'Punjab') setVehicleNumber('PB-10-CZ-8821');
    else if (newState === 'Bihar') setVehicleNumber('BR-01-GB-3341');
    else if (newState === 'Uttar Pradesh') setVehicleNumber('UP-80-BW-9012');
    else if (newState === 'Haryana') setVehicleNumber('HR-05-X-6731');
  };

  // Handle District Change
  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    if (!newDistrict) {
      setSelectedMandiId('');
      return;
    }
    const distMatch = availableDistricts.find((d) => d.name === newDistrict);
    if (distMatch && distMatch.mandis.length > 0) {
      setSelectedMandiId(distMatch.mandis[0].id);
    } else {
      setSelectedMandiId('');
    }
  };

  if (!isOpen || !currentFarmer) return null;

  const currentCropInfo = CROPS.find((c) => c.name === selectedCrop) || CROPS[0];
  const estimatedPayout = estimatedQuintals * currentCropInfo.msp;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    bookSlot({
      farmer_id: currentFarmer.id,
      farmer_name: currentFarmer.name,
      farmer_phone: currentFarmer.phone,
      farmer_village: currentFarmer.village,
      crop_type: selectedCrop,
      estimated_quintals: Number(estimatedQuintals),
      vehicle_type: vehicleType,
      vehicle_number: vehicleNumber.toUpperCase(),
      slot_date: selectedDate,
      slot_time: selectedSlot,
      msp_rate_per_quintal: currentCropInfo.msp,
      total_payout: estimatedPayout,
      state: selectedState,
      district: selectedDistrict,
      mandi_id: selectedMandi?.id || selectedMandiId,
      mandi_name: selectedMandi?.name || 'Local APMC Yard'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-tight">
              Book Agricultural Delivery Slot
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentFarmer.name} • +91 {currentFarmer.phone}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          
          {/* CASCADING MANDI SELECTORS: State -> District -> Mandi */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
              <span className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Procurement Center Destination</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">3-Step Cascading</span>
            </div>

            {/* Step 1: Select State */}
            <div>
              <label htmlFor="cascading-state-select" className="block text-slate-700 font-medium mb-1">
                1. Select State <span className="text-emerald-700">*</span>
              </label>
              <div className="relative">
                <select
                  id="cascading-state-select"
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  required
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 rounded-md text-xs text-slate-900 font-medium appearance-none cursor-pointer transition-colors"
                >
                  <option value="">-- Choose State --</option>
                  {STATE_HIERARCHY.map((item) => (
                    <option key={item.state} value={item.state}>
                      {item.state}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Step 2 & 3: District & Mandi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Step 2: Select District */}
              <div>
                <label htmlFor="cascading-district-select" className="block text-slate-700 font-medium mb-1">
                  2. Select District <span className="text-emerald-700">*</span>
                </label>
                <div className="relative">
                  <select
                    id="cascading-district-select"
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={!selectedState}
                    required
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 rounded-md text-xs text-slate-900 font-medium appearance-none cursor-pointer transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!selectedState ? 'Select state first' : '-- Choose District --'}
                    </option>
                    {availableDistricts.map((dist) => (
                      <option key={dist.name} value={dist.name}>
                        {dist.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Step 3: Select Mandi */}
              <div>
                <label htmlFor="cascading-mandi-select" className="block text-slate-700 font-medium mb-1">
                  3. Select Mandi Yard <span className="text-emerald-700">*</span>
                </label>
                <div className="relative">
                  <select
                    id="cascading-mandi-select"
                    value={selectedMandiId}
                    onChange={(e) => setSelectedMandiId(e.target.value)}
                    disabled={!selectedDistrict}
                    required
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 rounded-md text-xs text-slate-900 font-medium appearance-none cursor-pointer transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!selectedDistrict ? 'Select district first' : '-- Choose Mandi --'}
                    </option>
                    {availableMandis.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* DYNAMIC LIVE WAIT TIME BADGE */}
            {selectedMandi && (
              <div className="p-3 bg-white border border-slate-200 rounded-md shadow-2xs animate-fade-in transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-700">
                      Live Yard Status:
                    </span>
                    <span className="font-semibold text-slate-900 text-xs">
                      {selectedMandi.name}
                    </span>
                  </div>
                  {selectedMandi.status === 'critical' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                      Critical Wait
                    </span>
                  ) : selectedMandi.status === 'warning' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Moderate Delay
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Optimal Flow
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-[11px]">
                  <div className="p-1.5 bg-slate-50/70 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Live Wait Time</span>
                    <span className="font-mono font-bold text-slate-800 text-xs flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-emerald-700" />
                      ~{selectedMandi.waitTimeMinutes} mins
                    </span>
                  </div>
                  <div className="p-1.5 bg-slate-50/70 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Queue Density</span>
                    <span className="font-mono font-semibold text-slate-800 text-xs block mt-0.5">
                      {selectedMandi.activeVehicles} vehicles
                    </span>
                  </div>
                  <div className="p-1.5 bg-slate-50/70 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Open Counters</span>
                    <span className="font-mono font-semibold text-slate-800 text-xs block mt-0.5">
                      {selectedMandi.activeCounters} active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date and Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="slot-booking-date" className="block text-slate-700 font-medium mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Date</span>
              </label>
              <input
                id="slot-booking-date"
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label htmlFor="slot-time-select" className="block text-slate-700 font-medium mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Time Slot</span>
              </label>
              <div className="relative">
                <select
                  id="slot-time-select"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full pl-2.5 pr-7 py-1.5 border border-slate-200 rounded-md text-xs text-slate-900 appearance-none focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  {AVAILABLE_TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Crop Type & Load */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Crop Type
              </label>
              <div className="relative">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full pl-2.5 pr-7 py-1.5 border border-slate-200 rounded-md text-xs text-slate-900 appearance-none focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  {CROPS.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} (MSP ₹{c.msp})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="slot-quintals-input" className="block text-slate-700 font-medium mb-1 flex items-center gap-1">
                <Scale className="w-3 h-3 text-slate-400" />
                <span>Est. Load (Quintals)</span>
              </label>
              <input
                id="slot-quintals-input"
                type="number"
                min="5"
                max="300"
                value={estimatedQuintals}
                onChange={(e) => setEstimatedQuintals(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="slot-vehicle-type" className="block text-slate-700 font-medium mb-1 flex items-center gap-1">
                <Truck className="w-3 h-3 text-slate-400" />
                <span>Vehicle Type</span>
              </label>
              <div className="relative">
                <select
                  id="slot-vehicle-type"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full pl-2.5 pr-7 py-1.5 border border-slate-200 rounded-md text-xs text-slate-900 appearance-none focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="Tractor-Trolley">Tractor-Trolley</option>
                  <option value="Mini-Truck">Mini-Truck</option>
                  <option value="Heavy Truck">Heavy Truck</option>
                  <option value="Bullock Cart">Bullock Cart</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="vehicle-registration-no" className="block text-slate-700 font-medium mb-1">
                Vehicle Plate Number
              </label>
              <input
                id="vehicle-registration-no"
                type="text"
                required
                placeholder="MP-20-EA-4512"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          {/* MSP summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Government Guaranteed MSP Value</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {estimatedQuintals} Qtl × ₹{currentCropInfo.msp}/Qtl
              </span>
            </div>
            <span className="font-mono font-bold text-sm text-emerald-800">
              ₹{estimatedPayout.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-booking-btn"
              type="submit"
              disabled={!selectedState || !selectedDistrict || !selectedMandiId}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              Confirm Delivery Slot
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
