import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return requireAdmin(async (_req, res) => {
      const { data: users, error } = await supabaseAdmin
        .from("profiles")
        .select("id, email, first_name, last_name, full_name, role, breeder_verified, is_suspended, is_verified_breeder, phone, location, created_at, updated_at");
      if (error) return res.status(500).json({ message: error.message });
      res.status(200).json({ users: users || [] });
    })(req, res);
  }

  if (req.method === "PATCH") {
    return requireAdmin(async (req, res) => {
      const { id, suspended } = req.body;
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ is_suspended: suspended })
        .eq("id", id);
      if (error) return res.status(500).json({ message: error.message });
      res.status(200).json({ message: "Updated" });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}