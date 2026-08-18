import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type } = req.query;
  const db = await getDb();

  if (type) {
    const breeds = db.data.breeds.filter((b) => b.animalTypeId === type);
    return res.status(200).json({ breeds });
  }

  res.status(200).json({ breeds: db.data.breeds });
}