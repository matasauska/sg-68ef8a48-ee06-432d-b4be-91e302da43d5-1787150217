-- Enable RLS on all tables
ALTER TABLE breeder_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeder_verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- breeder_verifications: users see own, admins see all
CREATE POLICY "Users view own verification" ON breeder_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own verification" ON breeder_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own verification" ON breeder_verifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage verifications" ON breeder_verifications FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- breeder_verification_documents: users see own docs, admins see all
CREATE POLICY "Users view own docs" ON breeder_verification_documents FOR SELECT USING (EXISTS (SELECT 1 FROM breeder_verifications WHERE id = verification_id AND user_id = auth.uid()));
CREATE POLICY "Users insert own docs" ON breeder_verification_documents FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM breeder_verifications WHERE id = verification_id AND user_id = auth.uid()));
CREATE POLICY "Admins manage docs" ON breeder_verification_documents FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- animal_types: public read
CREATE POLICY "Public read animal_types" ON animal_types FOR SELECT USING (true);
CREATE POLICY "Admin manage animal_types" ON animal_types FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- breeds: public read
CREATE POLICY "Public read breeds" ON breeds FOR SELECT USING (true);
CREATE POLICY "Admin manage breeds" ON breeds FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- listings: public can view approved, breeders can manage own, admins manage all
CREATE POLICY "Public view approved listings" ON listings FOR SELECT USING (status = 'approved' OR breeder_id = auth.uid());
CREATE POLICY "Breeder insert own listings" ON listings FOR INSERT WITH CHECK (breeder_id = auth.uid());
CREATE POLICY "Breeder update own listings" ON listings FOR UPDATE USING (breeder_id = auth.uid());
CREATE POLICY "Breeder delete own listings" ON listings FOR DELETE USING (breeder_id = auth.uid());
CREATE POLICY "Admin manage listings" ON listings FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- saved_listings: users manage own
CREATE POLICY "Users view own saved" ON saved_listings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own saved" ON saved_listings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own saved" ON saved_listings FOR DELETE USING (user_id = auth.uid());

-- messages: users see messages they're part of
CREATE POLICY "Users view own messages" ON messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- reports: reporters manage own, admins see all
CREATE POLICY "Users view own reports" ON reports FOR SELECT USING (reporter_id = auth.uid());
CREATE POLICY "Users insert own reports" ON reports FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Admin manage reports" ON reports FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- subscriptions: users manage own
CREATE POLICY "Users view own subscriptions" ON subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (user_id = auth.uid());

-- support_tickets: users manage own, admins manage all
CREATE POLICY "Users view own tickets" ON support_tickets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own tickets" ON support_tickets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin manage tickets" ON support_tickets FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- support_ticket_messages: users in their tickets, admins all
CREATE POLICY "Users view ticket messages" ON support_ticket_messages FOR SELECT USING (EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users reply to tickets" ON support_ticket_messages FOR INSERT WITH CHECK (sender_id = auth.uid());