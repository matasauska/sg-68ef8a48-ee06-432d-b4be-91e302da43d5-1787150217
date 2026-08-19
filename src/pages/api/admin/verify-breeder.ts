import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  return requireAdmin(async (req, res) => {
    const { breederId, verified } = req.body;

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", breederId)
      .single();

    if (error || !profile) return res.status(404).json({ message: "Breeder not found" });

    await supabaseAdmin
      .from("profiles")
      .update({ breeder_verified: verified, is_verified_breeder: verified, role: verified ? "breeder" : "buyer" })
      .eq("id", breederId);

    await supabaseAdmin
      .from("breeder_profiles")
      .update({ verified })
      .eq("user_id", breederId);

    const { data: updated } = await supabaseAdmin
      .from("breeder_profiles")
      .select("*")
      .eq("user_id", breederId)
      .single();

    res.status(200).json({ breeder: updated });
  })(req, res);
}