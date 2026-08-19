import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  return requireAdmin(async (req, res) => {
    const [
      { data: users },
      { data: listings },
      { data: breederProfiles },
      { data: reports },
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select("role"),
      supabaseAdmin.from("listings").select("status"),
      supabaseAdmin.from("breeder_profiles").select("verified"),
      supabaseAdmin.from("reports").select("*"),
    ]);

    const stats = {
      totalUsers: (users || []).length,
      totalBreeders: (users || []).filter(u => u.role === "breeder").length,
      totalListings: (listings || []).length,
      activeListings: (listings || []).filter(l => l.status === "approved").length,
      soldListings: (listings || []).filter(l => l.status === "sold").length,
      pendingListings: (listings || []).filter(l => l.status === "pending").length,
      verifiedBreeders: (breederProfiles || []).filter(b => b.verified).length,
      totalReports: (reports || []).length,
    };

    res.status(200).json(stats);
  })(req, res);
}