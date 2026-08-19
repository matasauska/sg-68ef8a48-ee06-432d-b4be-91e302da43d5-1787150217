import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return requireAdmin(async (_req, res) => {
      const { data: reports, error } = await supabaseAdmin
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return res.status(500).json({ message: error.message });

      // Enrich with reporter names and target titles
      const enriched = await Promise.all((reports || []).map(async (r) => {
        const { data: reporter } = await supabaseAdmin
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", r.reporter_id)
          .single();
        const { data: target } = await supabaseAdmin
          .from("listings")
          .select("title")
          .eq("id", r.target_id)
          .single();
        return {
          ...r,
          reporterName: reporter ? `${reporter.first_name} ${reporter.last_name}` : "Unknown",
          targetTitle: target?.title || "Unknown",
        };
      }));

      res.status(200).json({ reports: enriched });
    })(req, res);
  }

  if (req.method === "PATCH") {
    return requireAdmin(async (req, res) => {
      const { id, status } = req.body;
      const { data, error } = await supabaseAdmin
        .from("reports")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) return res.status(500).json({ message: error.message });
      res.status(200).json({ report: data });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}