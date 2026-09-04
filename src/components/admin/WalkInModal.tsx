import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { CROPS } from '../../lib/mockData';
import type { VehicleType } from '../../types';
import { X } from 'lucide-react';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({ isOpen, onClose }) => {
  const { bookSlot } = useQueue();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0].name);
  const [estimatedQuintals, setEstimatedQuintals] = useState(45);
  const [vehicleType, setVehicleType] = useState<VehicleType>('Tractor-Trolley');
  const [vehicleNumber, setVehicleNumber] = useState('');

  if (!isOpen) return null;

  const currentCropInfo = CROPS.find((c) => c.name === selectedCrop) || CROPS[0];
  const estimatedPayout = estimatedQuintals * currentCropInfo.msp;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || phone.length < 10) return;

    bookSlot({
      farmer_id: `walkin-${Date.now()}`,
      farmer_name: name,
      farmer_phone: phone,
      farmer_village: village || 'Local Mandi Region',
      crop_type: selectedCrop,
      estimated_quintals: Number(estimatedQuintals),
      vehicle_type: vehicleType,
      vehicle_number: (vehicleNumber || 'HR-GATE-ENTRY').toUpperCase(),
      slot_date: new Date().toISOString().split('T')[0],
      slot_time: 'Direct Gate Entry',
      msp_rate_per_quintal: currentCropInfo.msp,
      total_payout: estimatedPayout
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 leading-tight">
              Register Walk-In Farmer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Issue an instant token at the gate
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="walkin-farmer-name" className="block text-slate-700 font-medium mb-1">
                Farmer Full Name
              </label>
              <input
                id="walkin-farmer-name"
                type="text"
                required
                placeholder="Jasbir Singh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label htmlFor="walkin-farmer-phone" className="block text-slate-700 font-medium mb-1">
                Mobile Number
              </label>
              <input
                id="walkin-farmer-phone"
                type="tel"
                maxLength={10}
                required
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="walkin-village-name" className="block text-slate-700 font-medium mb-1">
                Village / District
              </label>
              <input
                id="walkin-village-name"
                type="text"
                placeholder="Karnal, Haryana"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label htmlFor="walkin-vehicle-no" className="block text-slate-700 font-medium mb-1">
                Vehicle Plate No.
              </label>
              <input
                id="walkin-vehicle-no"
                type="text"
                placeholder="HR-05-AB-1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs font-mono text-slate-900 uppercase focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              >
                {CROPS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} (MSP ₹{c.msp})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="walkin-vehicle-type-select" className="block text-slate-700 font-medium mb-1">
                Vehicle Type
              </label>
              <select
                id="walkin-vehicle-type-select"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              >
                <option value="Tractor-Trolley">Tractor-Trolley</option>
                <option value="Mini-Truck">Mini-Truck</option>
                <option value="Heavy Truck">Heavy Truck</option>
                <option value="Bullock Cart">Bullock Cart</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="walkin-est-quintals" className="block text-slate-700 font-medium mb-1">
              Estimated Weight (Quintals)
            </label>
            <input
              id="walkin-est-quintals"
              type="number"
              min="5"
              max="500"
              value={estimatedQuintals}
              onChange={(e) => setEstimatedQuintals(Number(e.target.value))}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Cancel
            </button>
            <button
              id="walkin-submit-btn"
              type="submit"
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-medium transition-colors"
            >
              Generate Token
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
