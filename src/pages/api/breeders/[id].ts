import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const db = await getDb();

  const breeder = db.data.breederProfiles.find(p => p.id === id);
  if (!breeder) {
    return res.status(404).json({ message: "Breeder not found" });
  }

  const user = db.data.users.find(u => u.id === breeder.userId);
  const listings = db.data.listings.filter(l => l.breederId === breeder.id && l.status === "active");
  const reviews = db.data.reviews.filter(r => r.breederId === breeder.id);

  res.status(200).json({
    breeder,
    user: user ? { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatarUrl: user.avatarUrl } : null,
    listings,
    reviews,
  });
}