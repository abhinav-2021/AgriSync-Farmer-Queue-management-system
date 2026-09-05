import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Booking, Farmer, Language, QueueStage, QueueStats, ToastMessage, PortalView, AdminTab, MandiCenter, StateFilter } from '../types';
import { INITIAL_BOOKINGS, MOCK_FARMERS, MOCK_MANDIS } from '../lib/mockData';
import { supabase, isSupabaseConfigured, localBroadcastChannel } from '../lib/supabaseClient';
import { soundService } from '../lib/sound';
import { i18n } from '../lib/i18n';

interface QueueContextType {
  // State
  bookings: Booking[];
  mandis: MandiCenter[];
  currentFarmer: Farmer | null;
  activeCalledToken: string | null;
  activeCounter: string;
  language: Language;
  portalView: PortalView;
  adminTab: AdminTab;
  isSidebarOpenMobile: boolean;
  soundEnabled: boolean;
  toasts: ToastMessage[];
  stats: QueueStats;
  isRealtimeConnected: boolean;
  isLoading: boolean;
  databaseError: string | null;
  globalSearchQuery: string;
  selectedStateFilter: StateFilter;

  // Setters / Actions
  setCurrentFarmer: (farmer: Farmer | null) => void;
  loginFarmer: (phone: string, name?: string, village?: string, state?: string) => Farmer;
  logoutFarmer: () => void;
  setLanguage: (lang: Language) => void;
  setPortalView: (view: PortalView) => void;
  setAdminTab: (tab: AdminTab) => void;
  setIsSidebarOpenMobile: (open: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setActiveCounter: (counter: string) => void;
  setGlobalSearchQuery: (query: string) => void;
  setSelectedStateFilter: (filter: StateFilter) => void;
  
  // Mandi Operations
  addMandi: (mandiData: Omit<MandiCenter, 'id' | 'status' | 'waitTimeMinutes' | 'activeVehicles' | 'todayQuintals'> & { password?: string; email?: string }) => MandiCenter;
  removeMandi: (mandiId: string) => void;

  // Queue Operations
  bookSlot: (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'token_number' | 'status' | 'stage_timestamps'>) => Promise<Booking>;
  callNextToken: (customToken?: string, counter?: string) => Promise<Booking | null>;
  updateBookingStage: (bookingId: string, stage: QueueStage, extras?: Partial<Booking>) => Promise<void>;
  fetchQueueData: () => Promise<void>;
  dismissToast: (id: string) => void;
  triggerToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  resetToMockData: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const STORAGE_KEY_BOOKINGS = 'agrisync_bookings_v3';
const STORAGE_KEY_ACTIVE_TOKEN = 'agrisync_active_token_v3';
const STORAGE_KEY_FARMER = 'agrisync_current_farmer_v3';
const STORAGE_KEY_VIEW = 'agrisync_portal_view_v3';
const STORAGE_KEY_MANDIS = 'agrisync_mandis_v2';

// Helper to ensure every mandi center has valid official APMC credentials
const initializeMandisWithCredentials = (items: MandiCenter[]): MandiCenter[] => {
  return items.map((m) => {
    const slug = (m.district || m.name).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanDistrict = (m.district || m.name).replace(/[^a-zA-Z]/g, '');
    return {
      ...m,
      officialEmail: m.officialEmail || `mandi.${slug}@agrisync.gov.in`,
      accessPassword: m.accessPassword || `${cleanDistrict || 'Mandi'}@2026`,
      contactPhone: m.contactPhone || '9876543210',
      createdAt: m.createdAt || '2026-01-15T08:00:00.000Z'
    };
  });
};

// Normalizes status strings from either 'REGISTERED' or 'registered'
const normalizeStage = (status: string): QueueStage => {
  const lower = (status || 'registered').toLowerCase() as QueueStage;
  if (['registered', 'verified', 'weighed', 'paid', 'completed', 'cancelled'].includes(lower)) {
    return lower;
  }
  return 'registered';
};

// Maps raw database record to frontend Booking model
const mapDbRowToBooking = (row: any): Booking => {
  return {
    id: row.id || `b-${row.token_number}`,
    farmer_id: row.farmer_id || 'f-1',
    farmer_name: row.farmer_name || 'Farmer',
    farmer_phone: row.farmer_phone || '',
    farmer_village: row.farmer_village || 'Local Mandi Region',
    token_number: row.token_number || 'A-100',
    crop_type: row.crop_type || 'Wheat (गेहूं)',
    estimated_quintals: Number(row.estimated_quintals) || 50,
    vehicle_type: row.vehicle_type || 'Tractor-Trolley',
    vehicle_number: row.vehicle_number || 'HR-05-XX-0000',
    slot_date: row.slot_date || new Date().toISOString().split('T')[0],
    slot_time: row.slot_time || '10:00 AM - 11:00 AM',
    status: normalizeStage(row.status),
    counter_assigned: row.counter_assigned || 'Gate Entry 1',
    moisture_percentage: row.moisture_percentage ? Number(row.moisture_percentage) : undefined,
    actual_weight_quintals: row.actual_weight_quintals ? Number(row.actual_weight_quintals) : undefined,
    msp_rate_per_quintal: row.msp_rate_per_quintal ? Number(row.msp_rate_per_quintal) : 2275,
    total_payout: row.total_payout ? Number(row.total_payout) : undefined,
    state: row.state,
    district: row.district,
    mandi_id: row.mandi_id,
    mandi_name: row.mandi_name,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
    stage_timestamps: {
      registered_at: row.registered_at,
      verified_at: row.verified_at,
      weighed_at: row.weighed_at,
      paid_at: row.paid_at,
      completed_at: row.completed_at
    }
  };
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Local State
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [mandis, setMandis] = useState<MandiCenter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MANDIS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return initializeMandisWithCredentials(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load stored mandis', e);
    }
    const initial = initializeMandisWithCredentials(MOCK_MANDIS);
    try {
      localStorage.setItem(STORAGE_KEY_MANDIS, JSON.stringify(initial));
    } catch {}
    return initial;
  });

  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FARMER);
      return saved ? JSON.parse(saved) : MOCK_FARMERS[0];
    } catch {
      return MOCK_FARMERS[0];
    }
  });

  const [activeCalledToken, setActiveCalledToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_TOKEN) || 'A-104';
    } catch {
      return 'A-104';
    }
  });

  const [activeCounter, setActiveCounter] = useState<string>('Gate Entry 1');
  const [language, setLanguageState] = useState<Language>(() => {
    return ((i18n.language?.split('-')[0] || localStorage.getItem('agrisync_language') || 'en') as Language);
  });

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const baseLng = (lng.split('-')[0] || 'en') as Language;
      setLanguageState(baseLng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
  }, []);
  // Always default to landing page to prevent unauthenticated portal bypass
  const [portalView, setPortalView] = useState<PortalView>('landing');

  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [selectedStateFilter, setSelectedStateFilter] = useState<StateFilter>('all');

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      if (activeCalledToken) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_TOKEN, activeCalledToken);
      }
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [activeCalledToken]);

  useEffect(() => {
    try {
      if (currentFarmer) {
        localStorage.setItem(STORAGE_KEY_FARMER, JSON.stringify(currentFarmer));
      } else {
        localStorage.removeItem(STORAGE_KEY_FARMER);
      }
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [currentFarmer]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_VIEW, portalView);
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [portalView]);

  // Toast Helper with Audio
  const triggerToast = useCallback((toastData: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const newToast: ToastMessage = {
      ...toastData,
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    if (soundEnabled) {
      if (toastData.type === 'urgent') {
        soundService.playTokenCallChime();
      } else {
        soundService.playSuccessChime();
      }
    }

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
  }, [soundEnabled]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Step 2 & 4: Initial Data Fetching from Supabase (queue_slots / bookings)
  const fetchQueueData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsRealtimeConnected(true);
      return;
    }

    setIsLoading(true);
    setDatabaseError(null);

    try {
      // 1. Try fetching from queue_slots table
      let { data, error } = await supabase
        .from('queue_slots')
        .select('*')
        .order('created_at', { ascending: true });

      // 2. If queue_slots not found, try fallback table 'bookings'
      if (error || !data) {
        const fallback = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (!fallback.error && fallback.data) {
          data = fallback.data;
          error = null;
        }
      }

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const loadedBookings = data.map(mapDbRowToBooking);
        setBookings(loadedBookings);

        // Set active called token if available in the dataset
        const active = loadedBookings.find((b) => b.status === 'registered' || b.status === 'verified');
        if (active) {
          setActiveCalledToken(active.token_number);
        }
      }
      setIsRealtimeConnected(true);
    } catch (err: any) {
      console.warn('Supabase fetch notice (using local cache / fallback):', err.message);
      setDatabaseError(err.message || 'Database connection notice');
      // Keep local bookings state intact
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on initial mount
  useEffect(() => {
    fetchQueueData();
  }, [fetchQueueData]);

  // Step 3: Supabase Realtime Subscription ('custom-update-channel')
  useEffect(() => {
    // 1. Local BroadcastChannel cross-tab synchronization
    if (localBroadcastChannel) {
      localBroadcastChannel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'SYNC_STATE') {
          if (payload.bookings) setBookings(payload.bookings);
          if (payload.activeCalledToken) setActiveCalledToken(payload.activeCalledToken);
          if (payload.toast) {
            triggerToast(payload.toast);
          }
        }
      };
    }

    // 2. Live Supabase Realtime Channel
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('custom-update-channel')
        // Listen on queue_slots table
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'queue_slots' },
          (payload) => {
            handleRealtimePayload(payload);
          }
        )
        // Listen on bookings table for full compatibility
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          (payload) => {
            handleRealtimePayload(payload);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsRealtimeConnected(true);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsRealtimeConnected(false);
          }
        });

      const handleRealtimePayload = (payload: any) => {
        if (payload.eventType === 'INSERT') {
          const newBooking = mapDbRowToBooking(payload.new);
          setBookings((prev) => {
            const exists = prev.some((b) => b.id === newBooking.id || b.token_number === newBooking.token_number);
            return exists ? prev : [...prev, newBooking];
          });
        } else if (payload.eventType === 'UPDATE') {
          const updatedBooking = mapDbRowToBooking(payload.new);
          setBookings((prev) =>
            prev.map((b) => (b.id === updatedBooking.id || b.token_number === updatedBooking.token_number ? { ...b, ...updatedBooking } : b))
          );

          // If this is the active called token, update active token state
          if (payload.new.counter_assigned) {
            setActiveCalledToken(updatedBooking.token_number);
          }

          // Trigger simulated UI toast alert on screen for farmer and mandi
          const isCurrentFarmer = currentFarmer && updatedBooking.farmer_phone === currentFarmer.phone;
          const isTokenCall = payload.new.counter_assigned && updatedBooking.status === 'registered';

          if (isCurrentFarmer && isTokenCall) {
            triggerToast({
              title: `🚨 Alert: Your token #${updatedBooking.token_number} has been called!`,
              message: `Please proceed with vehicle ${updatedBooking.vehicle_number} to ${updatedBooking.counter_assigned || 'Gate Entry 1'}`,
              type: 'urgent',
              token: updatedBooking.token_number
            });
          } else {
            triggerToast({
              title: `Live Update: Token #${updatedBooking.token_number}`,
              message: `${updatedBooking.farmer_name} - Stage advanced to ${updatedBooking.status.toUpperCase()}`,
              type: updatedBooking.status === 'paid' ? 'success' : 'urgent',
              token: updatedBooking.token_number
            });
          }
        }
      };

      const client = supabase;
      return () => {
        if (client) {
          client.removeChannel(channel);
        }
      };
    }
  }, [currentFarmer, triggerToast]);

  // Broadcast sync helper
  const broadcastSync = (updatedBookings: Booking[], updatedActiveToken?: string | null, toastToSend?: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    if (localBroadcastChannel) {
      localBroadcastChannel.postMessage({
        type: 'SYNC_STATE',
        payload: {
          bookings: updatedBookings,
          activeCalledToken: updatedActiveToken,
          toast: toastToSend
        }
      });
    }
  };

  // Farmer Login - Persists directly to Supabase & localStorage
  const loginFarmer = (phone: string, name?: string, village?: string, state?: string): Farmer => {
    const newFarmer: Farmer = {
      id: `f-${phone.slice(-6)}`,
      name: name || `Farmer (+91 ${phone})`,
      phone,
      village: village || 'Local Agricultural Region',
      state: state || 'Haryana'
    };

    setCurrentFarmer(newFarmer);
    try {
      localStorage.setItem(STORAGE_KEY_FARMER, JSON.stringify(newFarmer));
    } catch (e) {
      console.error(e);
    }

    // Sync with Supabase public.farmers table
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('farmers')
        .upsert([{
          name: newFarmer.name,
          phone: newFarmer.phone,
          village: newFarmer.village,
          state: newFarmer.state
        }], { onConflict: 'phone' })
        .then(({ error }) => {
          if (error) console.warn('Supabase farmer upsert notice:', error.message);
        });
    }

    return newFarmer;
  };

  const logoutFarmer = () => {
    setCurrentFarmer(null);
    setPortalView('landing');
    try {
      localStorage.removeItem(STORAGE_KEY_FARMER);
      sessionStorage.removeItem(STORAGE_KEY_VIEW);
    } catch (e) {
      console.error(e);
    }
  };

  // Add a new APMC Mandi with auto-generated credentials
  const addMandi = useCallback(
    (
      mandiData: Omit<
        MandiCenter,
        'id' | 'status' | 'waitTimeMinutes' | 'activeVehicles' | 'todayQuintals'
      > & { password?: string; email?: string }
    ): MandiCenter => {
      const cleanDistrict = mandiData.district.trim();
      const slugDistrict = cleanDistrict.toLowerCase().replace(/[^a-z0-9]/g, '');
      const uniqueSuffix = Date.now().toString().slice(-4);
      const generatedEmail =
        mandiData.officialEmail?.trim() ||
        mandiData.email?.trim() ||
        `mandi.${slugDistrict || 'centre'}.${uniqueSuffix}@agrisync.gov.in`;

      const generatedPassword =
        mandiData.accessPassword?.trim() ||
        mandiData.password?.trim() ||
        `Mandi#${cleanDistrict.replace(/[^a-zA-Z]/g, '') || 'India'}${uniqueSuffix}`;

      const newMandi: MandiCenter = {
        id: `mandi-${Date.now()}`,
        name: mandiData.name.trim(),
        district: cleanDistrict,
        state: mandiData.state || 'Haryana',
        status: 'optimal',
        waitTimeMinutes: 15,
        activeVehicles: 0,
        activeCounters: Number(mandiData.activeCounters) || 4,
        todayQuintals: 0,
        dailyCapacity: Number(mandiData.dailyCapacity) || 20000,
        headOperator: mandiData.headOperator?.trim() || 'Assigned Officer',
        officialEmail: generatedEmail,
        accessPassword: generatedPassword,
        contactPhone: mandiData.contactPhone || '9876543210',
        createdAt: new Date().toISOString()
      };

      setMandis((prev) => {
        const updated = [newMandi, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY_MANDIS, JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save mandis', e);
        }
        return updated;
      });

      triggerToast({
        title: 'Mandi Centre Registered',
        message: `${newMandi.name} added. Operator login generated: ${newMandi.officialEmail}`,
        type: 'success'
      });

      return newMandi;
    },
    [triggerToast]
  );

  // Decommission and remove a Mandi
  const removeMandi = useCallback(
    (mandiId: string) => {
      setMandis((prev) => {
        const target = prev.find((m) => m.id === mandiId);
        const updated = prev.filter((m) => m.id !== mandiId);
        try {
          localStorage.setItem(STORAGE_KEY_MANDIS, JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save mandis after removal', e);
        }
        if (target) {
          triggerToast({
            title: 'Mandi Decommissioned',
            message: `${target.name} (${target.district}) was removed and operator access revoked.`,
            type: 'urgent'
          });
        }
        return updated;
      });
    },
    [triggerToast]
  );

  // Step 2 & 3: Book Slot Mutation
  const bookSlot = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'token_number' | 'status' | 'stage_timestamps'>): Promise<Booking> => {
    const nextNum = bookings.length + 101;
    const token = `A-${nextNum}`;
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newBooking: Booking = {
      ...bookingData,
      id: `b-${Date.now()}`,
      token_number: token,
      status: 'registered',
      counter_assigned: 'Gate Entry 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      stage_timestamps: {
        registered_at: nowTimeStr
      }
    };

    const nextBookings = [...bookings, newBooking];
    setBookings(nextBookings);

    const toastData = {
      title: `Slot Booked: Token #${token}`,
      message: `Confirmed for ${newBooking.slot_date} (${newBooking.slot_time}). Token assigned.`,
      type: 'success' as const,
      token: token
    };

    triggerToast(toastData);
    broadcastSync(nextBookings, activeCalledToken, toastData);

    // Write to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          farmer_name: newBooking.farmer_name,
          farmer_phone: newBooking.farmer_phone,
          farmer_village: newBooking.farmer_village,
          token_number: newBooking.token_number,
          crop_type: newBooking.crop_type,
          estimated_quintals: newBooking.estimated_quintals,
          vehicle_type: newBooking.vehicle_type,
          vehicle_number: newBooking.vehicle_number,
          slot_date: newBooking.slot_date,
          slot_time: newBooking.slot_time,
          status: 'registered',
          counter_assigned: newBooking.counter_assigned,
          state: newBooking.state,
          district: newBooking.district,
          mandi_id: newBooking.mandi_id,
          mandi_name: newBooking.mandi_name,
          msp_rate_per_quintal: newBooking.msp_rate_per_quintal,
          total_payout: newBooking.total_payout,
          registered_at: nowTimeStr
        };

        const res1 = await supabase.from('queue_slots').insert([payload]);
        if (res1.error) {
          await supabase.from('bookings').insert([payload]);
        }
      } catch (err) {
        console.warn('Supabase insert error (using local state):', err);
      }
    }

    return newBooking;
  };

  // Step 2: "Call Next Token" Mutation in Admin Dashboard
  const callNextToken = async (customToken?: string, counter?: string): Promise<Booking | null> => {
    let targetBooking: Booking | undefined;

    if (customToken) {
      targetBooking = bookings.find((b) => b.token_number.toLowerCase() === customToken.toLowerCase());
    } else {
      targetBooking = bookings.find((b) => b.status === 'registered' && b.token_number !== activeCalledToken)
        || bookings.find((b) => b.status !== 'completed' && b.status !== 'paid');
    }

    if (!targetBooking) {
      triggerToast({
        title: 'No Waiting Tokens',
        message: 'All registered farmers for this slot have been served or called.',
        type: 'info'
      });
      return null;
    }

    const assignedCounter = counter || activeCounter || 'Gate Entry 1';
    const nextActiveToken = targetBooking.token_number;
    setActiveCalledToken(nextActiveToken);

    const updatedBookings = bookings.map((b) =>
      b.id === targetBooking!.id ? { ...b, counter_assigned: assignedCounter, updated_at: new Date().toISOString() } : b
    );
    setBookings(updatedBookings);

    const toastData = {
      title: `🚨 NOW CALLING TOKEN #${nextActiveToken}`,
      message: `${targetBooking.farmer_name} (${targetBooking.vehicle_number}) please proceed to ${assignedCounter}!`,
      type: 'urgent' as const,
      token: nextActiveToken
    };

    triggerToast(toastData);
    broadcastSync(updatedBookings, nextActiveToken, toastData);

    // Execute Supabase UPDATE query on queue_slots table
    if (isSupabaseConfigured && supabase) {
      try {
        const updatePayload = {
          counter_assigned: assignedCounter,
          updated_at: new Date().toISOString()
        };

        const res1 = await supabase
          .from('queue_slots')
          .update(updatePayload)
          .eq('token_number', nextActiveToken);

        if (res1.error) {
          await supabase
            .from('bookings')
            .update(updatePayload)
            .eq('token_number', nextActiveToken);
        }
      } catch (err) {
        console.warn('Supabase update token call error:', err);
      }
    }

    return targetBooking;
  };

  // Step 2: Stage Progression Mutation (e.g. 'registered' -> 'verified' -> 'weighed' -> 'paid')
  const updateBookingStage = async (bookingId: string, stage: QueueStage, extras?: Partial<Booking>) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedTarget: Booking | null = null;

    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId || b.token_number === bookingId) {
        const timestamps = { ...b.stage_timestamps };
        if (stage === 'registered') timestamps.registered_at = timestamps.registered_at || timeNow;
        if (stage === 'verified') timestamps.verified_at = timeNow;
        if (stage === 'weighed') timestamps.weighed_at = timeNow;
        if (stage === 'paid') timestamps.paid_at = timeNow;
        if (stage === 'completed') timestamps.completed_at = timeNow;

        updatedTarget = {
          ...b,
          status: stage,
          stage_timestamps: timestamps,
          updated_at: new Date().toISOString(),
          ...extras
        };
        return updatedTarget;
      }
      return b;
    });

    setBookings(updatedBookings);

    if (updatedTarget) {
      const stageLabels: Record<QueueStage, string> = {
        registered: 'Gate Entry Verified',
        verified: 'Quality Checked & Approved',
        weighed: 'Weighbridge Recorded',
        paid: 'MSP DBT Payment Credited',
        completed: 'Procurement Cycle Completed',
        cancelled: 'Booking Cancelled'
      };

      const target = updatedTarget as Booking;
      const toastData = {
        title: `Token #${target.token_number}: ${stageLabels[stage]}`,
        message: `${target.farmer_name} - Stage updated to ${stage.toUpperCase()}`,
        type: stage === 'paid' ? 'success' as const : 'urgent' as const,
        token: target.token_number
      };

      triggerToast(toastData);
      broadcastSync(updatedBookings, activeCalledToken, toastData);

      // Execute Supabase UPDATE query on queue_slots table
      if (isSupabaseConfigured && supabase) {
        try {
          const updatePayload: Record<string, any> = {
            status: stage,
            updated_at: new Date().toISOString(),
            ...extras
          };

          if (stage === 'verified') updatePayload.verified_at = timeNow;
          if (stage === 'weighed') updatePayload.weighed_at = timeNow;
          if (stage === 'paid') updatePayload.paid_at = timeNow;

          const res1 = await supabase
            .from('queue_slots')
            .update(updatePayload)
            .or(`id.eq.${bookingId},token_number.eq.${target.token_number}`);

          if (res1.error) {
            await supabase
              .from('bookings')
              .update(updatePayload)
              .or(`id.eq.${bookingId},token_number.eq.${target.token_number}`);
          }
        } catch (err) {
          console.warn('Supabase stage update error:', err);
        }
      }
    }
  };

  // Reset to original mock state
  const resetToMockData = () => {
    setBookings(INITIAL_BOOKINGS);
    setActiveCalledToken('A-104');
    setCurrentFarmer(MOCK_FARMERS[0]);
    localStorage.removeItem(STORAGE_KEY_BOOKINGS);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_TOKEN);
    localStorage.removeItem(STORAGE_KEY_FARMER);
    triggerToast({
      title: 'Data Reset',
      message: 'Restored initial sample queue and farmer records.',
      type: 'info'
    });
  };

  // Compute Queue Stats
  const stats: QueueStats = {
    totalBookingsToday: bookings.length,
    activeToken: activeCalledToken,
    waitingCount: bookings.filter((b) => b.status === 'registered').length,
    verifiedCount: bookings.filter((b) => b.status === 'verified').length,
    weighedCount: bookings.filter((b) => b.status === 'weighed').length,
    paidCount: bookings.filter((b) => b.status === 'paid' || b.status === 'completed').length,
    totalQuintals: bookings.reduce((sum, b) => sum + (b.actual_weight_quintals || b.estimated_quintals || 0), 0),
    avgWaitTimeMinutes: 18
  };

  return (
    <QueueContext.Provider
      value={{
        bookings,
        mandis,
        currentFarmer,
        activeCalledToken,
        activeCounter,
        language,
        portalView,
        adminTab,
        isSidebarOpenMobile,
        soundEnabled,
        toasts,
        stats,
        isRealtimeConnected,
        isLoading,
        databaseError,
        globalSearchQuery,
        setCurrentFarmer,
        loginFarmer,
        logoutFarmer,
        setLanguage,
        setPortalView,
        setAdminTab,
        setIsSidebarOpenMobile,
        setSoundEnabled,
        setActiveCounter,
        setGlobalSearchQuery,
        selectedStateFilter,
        setSelectedStateFilter,
        addMandi,
        removeMandi,
        bookSlot,
        callNextToken,
        updateBookingStage,
        fetchQueueData,
        dismissToast,
        triggerToast,
        resetToMockData
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
