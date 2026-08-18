import type { NextApiRequest, NextApiResponse } from "next";
import { getDb, generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(3),
  animalType: z.string(),
  breed: z.string(),
  gender: z.enum(["Male", "Female"]),
  dateOfBirth: z.string(),
  price: z.number().min(0),
  location: z.string(),
  description: z.string().min(10),
  photos: z.array(z.string()).min(1),
  videoUrl: z.string().optional(),
  vaccinated: z.boolean(),
  microchipped: z.boolean(),
  pedigree: z.boolean(),
  healthInfo: z.string().optional(),
  parentsInfo: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const db = await getDb();
    const { type, breed, gender, minPrice, maxPrice, location, verified, sort } = req.query;

    let results = db.data.listings.filter((l) => l.status === "approved");

    if (type && type !== "all") {
      results = results.filter((l) => l.animalType === type);
    }
    if (breed && breed !== "all") {
      results = results.filter((l) => l.breed === breed);
    }
    if (gender && gender !== "all") {
      results = results.filter((l) => l.gender === gender);
    }
    if (minPrice) {
      results = results.filter((l) => l.price >= Number(minPrice));
    }
    if (maxPrice) {
      results = results.filter((l) => l.price <= Number(maxPrice));
    }
    if (location) {
      results = results.filter((l) => l.location.toLowerCase().includes(String(location).toLowerCase()));
    }
    if (verified === "true") {
      results = results.filter((l) => l.breederVerified);
    }

    if (sort === "newest") {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "price_asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      results.sort((a, b) => b.price - a.price);
    } else {
      results.sort((a, b) => {
        if (a.isPremium !== b.isPremium) return b.isPremium ? 1 : -1;
        if (a.isBoosted !== b.isBoosted) return b.isBoosted ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return res.status(200).json({ listings: results });
  }

  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      if (user.role !== "breeder" && user.role !== "admin") {
        return res.status(403).json({ message: "Only breeders can create listings" });
      }

      const data = createSchema.parse(req.body);
      const db = await getDb();

      const breederProfile = db.data.breederProfiles.find((bp) => bp.userId === user.id);
      const breederName = breederProfile?.kennelName || `${user.firstName} ${user.lastName}`;
      const breederVerified = breederProfile?.verified || false;

      const now = new Date().toISOString();
      const listing = {
        id: generateId(),
        breederId: breederProfile?.id || user.id,
        breederName,
        breederVerified,
        ...data,
        status: "pending" as const,
        isBoosted: false,
        isPremium: false,
        viewCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      db.data.listings.push(listing);
      await db.write();

      res.status(201).json({ listing });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}