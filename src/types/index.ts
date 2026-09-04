export type QueueStage = 'registered' | 'verified' | 'weighed' | 'paid' | 'completed' | 'cancelled';

export type CropType = 'Wheat (गेहूं)' | 'Paddy (धान)' | 'Mustard (सरसों)' | 'Cotton (कपास)' | 'Maize (मक्का)' | 'Soyabean (सोयाबीन)';

export type VehicleType = 'Tractor-Trolley' | 'Mini-Truck' | 'Heavy Truck' | 'Bullock Cart';

export type PortalView = 'landing' | 'state-admin' | 'mandi-desk' | 'farmer';

export type AdminTab = 
  | 'dashboard'
  | 'centres'
  | 'farmers'
  | 'operators'
  | 'slots'
  | 'live-queue'
  | 'analytics'
  | 'settings';

export type StateFilter = 'all' | 'Haryana' | 'Madhya Pradesh' | 'Bihar' | 'Punjab' | 'Uttar Pradesh';

export type UserRole = 'farmer' | 'operator' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  role: UserRole;
  state?: string;
  district?: string;
  mandi_id?: string;
  mandi_name?: string;
  created_at?: string;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  aadhaar_last4?: string;
  state?: string;
  land_hectares?: number;
  total_procured_qtl?: number;
}

export interface Booking {
  id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  farmer_village: string;
  token_number: string;
  crop_type: string;
  estimated_quintals: number;
  vehicle_type: VehicleType;
  vehicle_number: string;
  slot_date: string;
  slot_time: string;
  status: QueueStage;
  counter_assigned?: string;
  moisture_percentage?: number;
  actual_weight_quintals?: number;
  msp_rate_per_quintal?: number;
  total_payout?: number;
  state?: string;
  district?: string;
  mandi_id?: string;
  mandi_name?: string;
  created_at: string;
  updated_at: string;
  stage_timestamps: {
    registered_at?: string;
    verified_at?: string;
    weighed_at?: string;
    paid_at?: string;
    completed_at?: string;
  };
}

export interface MandiCenter {
  id: string;
  name: string;
  district: string;
  state: string;
  status: 'critical' | 'warning' | 'optimal';
  waitTimeMinutes: number;
  activeVehicles: number;
  activeCounters: number;
  todayQuintals: number;
  dailyCapacity: number;
  headOperator: string;
}

export interface MandiOption {
  id: string;
  name: string;
  waitTimeMinutes: number;
  status: 'critical' | 'warning' | 'optimal';
  activeVehicles: number;
  activeCounters: number;
  headOperator?: string;
}

export interface DistrictData {
  name: string;
  mandis: MandiOption[];
}

export interface StateHierarchy {
  state: string;
  districts: DistrictData[];
}

export interface DailyProcurementData {
  day: string;
  date: string;
  volumeK: number; // in '000 Quintals
  payoutCr: number; // in Crores INR
  wheatK: number;
  paddyK: number;
  mustardK: number;
}

export interface QueueStats {
  totalBookingsToday: number;
  activeToken: string | null;
  waitingCount: number;
  verifiedCount: number;
  weighedCount: number;
  paidCount: number;
  totalQuintals: number;
  avgWaitTimeMinutes: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  timestamp: string;
  token?: string;
  audioPing?: boolean;
}

export type Language = 'en' | 'hi' | 'pa' | 'ta';
