-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids text[] NOT NULL DEFAULT '{}',
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  listing_title text,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  breeder_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewer_name text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'EUR',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add missing columns to listings
ALTER TABLE listings ADD COLUMN IF NOT EXISTS breeder_name text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS breeder_verified boolean DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS neutered boolean DEFAULT false;

-- Add missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_suspended boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash text;

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Conversation policies
CREATE POLICY "conversations_select" ON conversations FOR SELECT USING (auth.uid()::text = ANY(participant_ids));
CREATE POLICY "conversations_insert" ON conversations FOR INSERT WITH CHECK (auth.uid()::text = ANY(participant_ids));

-- Review policies
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Notification policies
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Payment policies
CREATE POLICY "payments_select" ON payments FOR SELECT USING (auth.uid() = user_id);