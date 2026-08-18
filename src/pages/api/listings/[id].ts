import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const db = await getDb();
  const listing = db.data.listings.find((l) => l.id === id);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (req.method === "GET") {
    listing.viewCount += 1;
    await db.write();
    return res.status(200).json({ listing });
  }

  if (req.method === "PUT") {
    return requireAuth(async (req, res, user) => {
      const breederProfile = db.data.breederProfiles.find((bp) => bp.userId === user.id);
      const isOwner = listing.breederId === (breederProfile?.id || user.id);
      const isAdmin = user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updates = req.body;
      Object.assign(listing, updates, { updatedAt: new Date().toISOString() });
      await db.write();

      res.status(200).json({ listing });
    })(req, res);
  }

  if (req.method === "DELETE") {
    return requireAuth(async (req, res, user) => {
      const breederProfile = db.data.breederProfiles.find((bp) => bp.userId === user.id);
      const isOwner = listing.breederId === (breederProfile?.id || user.id);
      const isAdmin = user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Not authorized" });
      }

      db.data.listings = db.data.listings.filter((l) => l.id !== id);
      await db.write();

      res.status(200).json({ message: "Listing deleted" });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}