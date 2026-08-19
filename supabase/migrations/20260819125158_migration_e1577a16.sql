-- First, add missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'buyer' CHECK (role IN ('buyer', 'breeder', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified_breeder boolean NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;