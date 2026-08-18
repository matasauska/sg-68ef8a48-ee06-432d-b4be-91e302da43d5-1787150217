import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/api-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  return requireAdmin(async (req, res) => {
    const db = await getDb();
    const stats = {
      totalUsers: db.data.users.length,
      totalBreeders: db.data.users.filter(u => u.role === "breeder").length,
      totalListings: db.data.listings.length,
      activeListings: db.data.listings.filter(l => l.status === "active").length,
      soldListings: db.data.listings.filter(l => l.status === "sold").length,
      pendingListings: db.data.listings.filter(l => l.status === "pending").length,
      verifiedBreeders: db.data.breederProfiles.filter(b => b.verified).length,
      totalReports: db.data.reports.length,
    };
    res.status(200).json(stats);
  })(req, res);
}