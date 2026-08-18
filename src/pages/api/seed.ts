import type { NextApiRequest, NextApiResponse } from "next";
import { seedDemoData } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await seedDemoData();
    res.status(200).json({ message: "Demo data seeded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to seed data" });
  }
}