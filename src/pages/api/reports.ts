import type { NextApiRequest, NextApiResponse } from "next";
import { getDb, generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      const { targetType, targetId, reason, details } = req.body;
      const db = await getDb();

      const report = {
        id: generateId(),
        reporterId: user.id,
        reporterName: `${user.firstName} ${user.lastName}`,
        targetType,
        targetId,
        reason,
        details,
        status: "open" as const,
        createdAt: new Date().toISOString(),
      };

      db.data.reports.push(report);
      await db.write();

      res.status(201).json({ report });
    })(req, res);
  }

  if (req.method === "GET") {
    return requireAuth(async (req, res, user) => {
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
      }

      const db = await getDb();
      res.status(200).json({ reports: db.data.reports });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}