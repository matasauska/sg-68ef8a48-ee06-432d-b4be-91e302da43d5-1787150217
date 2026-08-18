import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/api-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return requireAdmin(async (req, res) => {
      const db = await getDb();
      const reports = db.data.reports.map(r => {
        const reporter = db.data.users.find(u => u.id === r.reporterId);
        const target = db.data.listings.find(l => l.id === r.targetId);
        return {
          ...r,
          reporterName: reporter ? `${reporter.firstName} ${reporter.lastName}` : "Unknown",
          targetTitle: target?.title || "Unknown",
        };
      });
      res.status(200).json({ reports });
    })(req, res);
  }

  if (req.method === "PATCH") {
    return requireAdmin(async (req, res) => {
      const db = await getDb();
      const { id, status } = req.body;
      const report = db.data.reports.find(r => r.id === id);
      if (!report) return res.status(404).json({ message: "Not found" });
      report.status = status;
      await db.write();
      res.status(200).json({ report });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}