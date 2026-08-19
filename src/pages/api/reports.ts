import type { NextApiRequest, NextApiResponse } from "next";
import { generateId } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      const { targetType, targetId, reason, details } = req.body;

      const report = {
        id: generateId(),
        reporter_id: user.id,
        reporter_name: `${user.firstName} ${user.lastName}`,
        target_type: targetType,
        target_id: targetId,
        reason,
        details: details || "",
        status: "open",
        created_at: new Date().toISOString(),
      };

      const { error } = await supabaseAdmin.from("reports").insert(report);
      if (error) return res.status(500).json({ message: error.message });

      res.status(201).json({ report });
    })(req, res);
  }

  if (req.method === "GET") {
    return requireAdmin(async (req, res) => {
      const { data: reports, error } = await supabaseAdmin
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return res.status(500).json({ message: error.message });

      res.status(200).json({ reports: (reports || []).map(r => ({
        id: r.id,
        reporterId: r.reporter_id,
        reporterName: r.reporter_name,
        targetType: r.target_type,
        targetId: r.target_id,
        reason: r.reason,
        details: r.details,
        status: r.status,
        createdAt: r.created_at,
      })) });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}