-- AgriSync Supabase Database Schema (Multi-State Edition)
-- Run this script in your Supabase Project: Dashboard > SQL Editor > New query > Run

-- ==============================================================================
-- 1. Create farmers table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    village TEXT NOT NULL,
    aadhaar_last4 TEXT,
    state TEXT DEFAULT 'Haryana',
    land_hectares NUMERIC,
    total_procured_qtl NUMERIC,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure multi-state columns exist on farmers if table already created
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Haryana';
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS land_hectares NUMERIC;
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS total_procured_qtl NUMERIC;

-- ==============================================================================
-- 2. Create queue_slots table (Primary Realtime Queue Store)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.queue_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES public.farmers(id) ON DELETE SET NULL,
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT NOT NULL,
    farmer_village TEXT NOT NULL,
    token_number TEXT NOT NULL UNIQUE,
    crop_type TEXT NOT NULL,
    estimated_quintals NUMERIC NOT NULL,
    vehicle_type TEXT NOT NULL,
    vehicle_number TEXT NOT NULL,
    slot_date DATE NOT NULL,
    slot_time TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('registered', 'verified', 'weighed', 'paid', 'completed', 'cancelled', 'REGISTERED', 'VERIFIED', 'WEIGHED', 'PAID', 'COMPLETED', 'CANCELLED')),
    counter_assigned TEXT,
    moisture_percentage NUMERIC,
    actual_weight_quintals NUMERIC,
    msp_rate_per_quintal NUMERIC,
    total_payout NUMERIC,
    state TEXT DEFAULT 'Haryana',
    district TEXT,
    mandi_id TEXT,
    mandi_name TEXT,
    registered_at TEXT,
    verified_at TEXT,
    weighed_at TEXT,
    paid_at TEXT,
    completed_at TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Idempotent column additions for queue_slots
ALTER TABLE public.queue_slots ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Haryana';
ALTER TABLE public.queue_slots ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.queue_slots ADD COLUMN IF NOT EXISTS mandi_id TEXT;
ALTER TABLE public.queue_slots ADD COLUMN IF NOT EXISTS mandi_name TEXT;

-- ==============================================================================
-- 3. Create bookings table (Compatibility & Backup Storage)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES public.farmers(id) ON DELETE SET NULL,
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT NOT NULL,
    farmer_village TEXT NOT NULL,
    token_number TEXT NOT NULL,
    crop_type TEXT NOT NULL,
    estimated_quintals NUMERIC NOT NULL,
    vehicle_type TEXT NOT NULL,
    vehicle_number TEXT NOT NULL,
    slot_date DATE NOT NULL,
    slot_time TEXT NOT NULL,
    status TEXT NOT NULL,
    counter_assigned TEXT,
    moisture_percentage NUMERIC,
    actual_weight_quintals NUMERIC,
    msp_rate_per_quintal NUMERIC,
    total_payout NUMERIC,
    state TEXT DEFAULT 'Haryana',
    district TEXT,
    mandi_id TEXT,
    mandi_name TEXT,
    registered_at TEXT,
    verified_at TEXT,
    weighed_at TEXT,
    paid_at TEXT,
    completed_at TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Idempotent column additions for bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Haryana';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS mandi_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS mandi_name TEXT;

-- ==============================================================================
-- 4. Enable Row Level Security (RLS) & allow open access for hackathon / demo
-- ==============================================================================
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if needed to prevent duplicates
DROP POLICY IF EXISTS "Allow public read on farmers" ON public.farmers;
DROP POLICY IF EXISTS "Allow public insert on farmers" ON public.farmers;
DROP POLICY IF EXISTS "Allow public update on farmers" ON public.farmers;

DROP POLICY IF EXISTS "Allow public read on queue_slots" ON public.queue_slots;
DROP POLICY IF EXISTS "Allow public insert on queue_slots" ON public.queue_slots;
DROP POLICY IF EXISTS "Allow public update on queue_slots" ON public.queue_slots;
DROP POLICY IF EXISTS "Allow public delete on queue_slots" ON public.queue_slots;

DROP POLICY IF EXISTS "Allow public read on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public insert on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public update on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public delete on bookings" ON public.bookings;

-- Recreate open demo policies
CREATE POLICY "Allow public read on farmers" ON public.farmers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on farmers" ON public.farmers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on farmers" ON public.farmers FOR UPDATE USING (true);

CREATE POLICY "Allow public read on queue_slots" ON public.queue_slots FOR SELECT USING (true);
CREATE POLICY "Allow public insert on queue_slots" ON public.queue_slots FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on queue_slots" ON public.queue_slots FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on queue_slots" ON public.queue_slots FOR DELETE USING (true);

CREATE POLICY "Allow public read on bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on bookings" ON public.bookings FOR DELETE USING (true);

-- ==============================================================================
-- 5. Enable Realtime Replication for instant multi-user queue synchronization
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'farmers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.farmers;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'queue_slots'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_slots;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  END IF;
END $$;

-- Set replica identity to FULL so UPDATE/DELETE events contain complete record payloads
ALTER TABLE public.farmers REPLICA IDENTITY FULL;
ALTER TABLE public.queue_slots REPLICA IDENTITY FULL;
ALTER TABLE public.bookings REPLICA IDENTITY FULL;

-- ==============================================================================
-- 6. Seed initial multi-state demo data
-- ==============================================================================
INSERT INTO public.farmers (name, phone, village, aadhaar_last4, state, land_hectares, total_procured_qtl)
VALUES 
  ('Balwinder Singh', '9876543210', 'Rampur, Karnal', '4392', 'Haryana', 4.5, 145),
  ('Ramesh Kumar Patel', '9812345678', 'Kalyanpur, Sirsa', '8821', 'Haryana', 3.2, 110),
  ('Sunita Devi', '9898989898', 'Bishanpur, Kurukshetra', '1094', 'Haryana', 2.8, 85),
  ('Harpreet Kaur', '9765432109', 'Shahabad, Ambala', '5543', 'Punjab', 6.0, 240),
  ('Shivpal Singh Yadav', '9811223344', 'Panagar, Jabalpur', '9912', 'Madhya Pradesh', 5.2, 180),
  ('Ramakant Jha', '9822334455', 'Phulwari Sharif, Patna', '6142', 'Bihar', 2.1, 60),
  ('Virendra Pratap Singh', '9833445566', 'Fatehabad, Agra', '3819', 'Uttar Pradesh', 4.0, 130)
ON CONFLICT (phone) DO UPDATE SET 
  state = EXCLUDED.state,
  village = EXCLUDED.village;

INSERT INTO public.queue_slots (
  farmer_name, farmer_phone, farmer_village, token_number,
  crop_type, estimated_quintals, vehicle_type, vehicle_number,
  slot_date, slot_time, status, counter_assigned, moisture_percentage,
  actual_weight_quintals, msp_rate_per_quintal, total_payout,
  state, district, mandi_id, mandi_name, registered_at
)
VALUES
  ('Ramesh Kumar Patel', '9812345678', 'Kalyanpur, Sirsa', 'A-101', 'Wheat (गेहूं)', 65, 'Tractor-Trolley', 'HR-24-B-4412', CURRENT_DATE, '08:00 AM - 09:00 AM', 'paid', 'Counter 3 - Accounts DBT', 11.2, 64.8, 2275, 147420, 'Haryana', 'Sirsa', 'm-3', 'Sirsa Mandi', '08:05 AM'),
  ('Harpreet Kaur', '9765432109', 'Shahabad, Ambala', 'A-102', 'Paddy (धान)', 90, 'Heavy Truck', 'PB-11-K-9008', CURRENT_DATE, '09:00 AM - 10:00 AM', 'weighed', 'Weighbridge 1', 12.8, 88.5, 2183, 193195, 'Punjab', 'Ambala', 'm-4', 'Ambala Mandi', '09:02 AM'),
  ('Shivpal Singh Yadav', '9811223344', 'Panagar, Jabalpur', 'A-103', 'Wheat (गेहूं)', 70, 'Tractor-Trolley', 'MP-20-EA-4512', CURRENT_DATE, '09:00 AM - 10:00 AM', 'verified', 'Quality Lab 2', 10.5, 69.5, 2275, 158112, 'Madhya Pradesh', 'Jabalpur', 'mp-jab-1', 'Jabalpur APMC (Main Mandi)', '09:15 AM'),
  ('Balwinder Singh', '9876543210', 'Rampur, Karnal', 'A-104', 'Wheat (गेहूं)', 55, 'Tractor-Trolley', 'HR-05-X-6731', CURRENT_DATE, '10:00 AM - 11:00 AM', 'registered', 'Gate Entry 1', NULL, NULL, 2275, NULL, 'Haryana', 'Karnal', 'm-1', 'Karnal Mandi', '10:02 AM'),
  ('Ramakant Jha', '9822334455', 'Phulwari Sharif, Patna', 'A-105', 'Maize (मक्का)', 40, 'Mini-Truck', 'BR-01-GB-3341', CURRENT_DATE, '10:00 AM - 11:00 AM', 'registered', 'Gate Entry 1', NULL, NULL, 2090, NULL, 'Bihar', 'Patna', 'br-pat-1', 'Patna Bazar Samiti', '10:20 AM'),
  ('Virendra Pratap Singh', '9833445566', 'Fatehabad, Agra', 'A-106', 'Mustard (सरसों)', 35, 'Tractor-Trolley', 'UP-80-BW-9012', CURRENT_DATE, '11:00 AM - 12:00 PM', 'registered', 'Gate Entry 1', NULL, NULL, 5650, NULL, 'Uttar Pradesh', 'Agra', 'up-agr-1', 'Agra Fatehabad Road Mandi', '10:35 AM')
ON CONFLICT (token_number) DO NOTHING;

-- ==============================================================================
-- 7. User Profiles & Supabase Auth Integration
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'operator', 'admin')),
    state TEXT DEFAULT 'Haryana',
    district TEXT,
    mandi_id TEXT,
    mandi_name TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual insert on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual update on profiles" ON public.profiles;

CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow individual insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow individual update on profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile trigger on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, full_name, role, state)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'farmer'),
    COALESCE(new.raw_user_meta_data->>'state', 'Haryana')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add profiles to realtime publication if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;

