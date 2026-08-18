import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/api-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  return requireAdmin(async (req, res) => {
    const db = await getDb();
    const { breederId, verified } = req.body;

    const breeder = db.data.breederProfiles.find(b => b.id === breederId);
    if (!breeder) return res.status(404).json({ message: "Breeder not found" });

    breeder.verified = verified;
    breeder.verifiedAt = verified ? new Date().toISOString() : undefined;
    await db.write();

    res.status(200).json({ breeder });
  })(req, res);
}