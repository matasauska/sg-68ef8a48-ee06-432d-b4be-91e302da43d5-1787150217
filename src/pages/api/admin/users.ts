import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/api-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return requireAdmin(async (req, res) => {
      const db = await getDb();
      const users = db.data.users.map(u => {
        const { passwordHash, ...rest } = u;
        return rest;
      });
      res.status(200).json({ users });
    })(req, res);
  }

  if (req.method === "PATCH") {
    return requireAdmin(async (req, res) => {
      const db = await getDb();
      const { id, suspended } = req.body;
      const user = db.data.users.find(u => u.id === id);
      if (!user) return res.status(404).json({ message: "Not found" });
      user.isSuspended = suspended;
      await db.write();
      res.status(200).json({ message: "Updated" });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}