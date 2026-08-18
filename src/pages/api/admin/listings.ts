import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/api-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return requireAdmin(async (req, res) => {
      const db = await getDb();
      const listings = db.data.listings.map(l => {
        const breeder = db.data.breederProfiles.find(b => b.id === l.breederId);
        return { ...l, breederName: breeder?.kennelName || "Unknown" };
      });
      res.status(200).json({ listings });
    })(req, res);
  }

  if (req.method === "PATCH") {
    return requireAdmin(async (req, res) => {
      const db = await getDb();
      const { id, status } = req.body;
      const listing = db.data.listings.find(l => l.id === id);
      if (!listing) return res.status(404).json({ message: "Not found" });
      listing.status = status;
      await db.write();
      res.status(200).json({ listing });
    })(req, res);
  }

  if (req.method === "DELETE") {
    return requireAdmin(async (req, res) => {
      const db = await getDb();
      const { id } = req.query;
      db.data.listings = db.data.listings.filter(l => l.id !== id);
      await db.write();
      res.status(200).json({ message: "Deleted" });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}