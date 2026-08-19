import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { ticketId, senderId, content } = req.body;
    const { data, error } = await supabase
      .from("support_ticket_messages")
      .insert({ ticket_id: ticketId, sender_id: senderId, content })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "GET") {
    const { ticketId } = req.query;
    const { data, error } = await supabase
      .from("support_ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ messages: data });
  }

  res.status(405).json({ message: "Method not allowed" });
}