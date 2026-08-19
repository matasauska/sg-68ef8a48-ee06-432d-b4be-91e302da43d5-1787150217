import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, subject, description } = req.body;
    const { data, error } = await supabase
      .from("support_tickets")
      .insert({ user_id: userId, subject, description })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "GET") {
    const { userId, admin } = req.query;
    let query = supabase.from("support_tickets").select("*").order("created_at", { ascending: false });
    if (!admin && userId) query = query.eq("user_id", userId);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ tickets: data });
  }

  if (req.method === "PATCH") {
    const { ticketId, status, adminResponse } = req.body;
    const update: any = {};
    if (status) update.status = status;
    if (adminResponse) update.admin_response = adminResponse;
    const { data, error } = await supabase
      .from("support_tickets")
      .update(update)
      .eq("id", ticketId)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.status(405).json({ message: "Method not allowed" });
}