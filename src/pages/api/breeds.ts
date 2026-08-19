import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type } = req.query;
  let query = supabaseAdmin.from("breeds").select("*").order("name");
  if (type) query = query.eq("animal_type_id", String(type));

  const { data, error } = await query;
  if (error) return res.status(500).json({ message: error.message });
  res.status(200).json({ breeds: data || [] });
}