import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { data, error } = await supabaseAdmin.from("animal_types").select("*").order("name");
  if (error) return res.status(500).json({ message: error.message });
  res.status(200).json({ animalTypes: data || [] });
}