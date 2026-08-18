import type { NextApiRequest, NextApiResponse } from "next";
import { getDb, generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return requireAuth(async (req, res, user) => {
      const db = await getDb();
      const favorites = db.data.favorites.filter((f) => f.userId === user.id);
      const listings = db.data.listings.filter((l) => favorites.some((f) => f.listingId === l.id));
      res.status(200).json({ listings });
    })(req, res);
  }

  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      const { listingId } = req.body;
      const db = await getDb();

      const existing = db.data.favorites.find((f) => f.userId === user.id && f.listingId === listingId);
      if (existing) {
        db.data.favorites = db.data.favorites.filter((f) => f.id !== existing.id);
        await db.write();
        return res.status(200).json({ favorited: false });
      }

      db.data.favorites.push({
        id: generateId(),
        userId: user.id,
        listingId,
        createdAt: new Date().toISOString(),
      });
      await db.write();
      res.status(201).json({ favorited: true });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}