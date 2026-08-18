import type { NextApiRequest, NextApiResponse } from "next";
import { getDb, generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";
import type { BreederProfile } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const db = await getDb();
    return res.status(200).json({ breederProfiles: db.data.breederProfiles });
  }

  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      if (user.role !== "breeder" && user.role !== "admin") {
        return res.status(403).json({ message: "Must be a breeder" });
      }

      const db = await getDb();
      const existing = db.data.breederProfiles.find(p => p.userId === user.id);
      if (existing) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      const now = new Date().toISOString();
      const profile: BreederProfile = {
        id: generateId(),
        userId: user.id,
        kennelName: req.body.kennelName,
        about: req.body.about || "",
        location: req.body.location,
        experienceYears: req.body.experienceYears || 0,
        breeds: req.body.breeds || [],
        website: req.body.website,
        verified: false,
        verificationRequested: false,
        totalListings: 0,
        createdAt: now,
        updatedAt: now,
      };

      db.data.breederProfiles.push(profile);
      await db.write();

      res.status(201).json({ profile });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}