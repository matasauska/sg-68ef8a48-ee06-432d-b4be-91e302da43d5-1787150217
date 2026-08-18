import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { verifyToken, parseAuthCookie, getPublicUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const cookieHeader = req.headers.cookie || "";
    const token = parseAuthCookie(cookieHeader);

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const db = await getDb();
    const user = db.data.users.find((u) => u.id === payload.userId);

    if (!user || user.isSuspended) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({ user: getPublicUser(user) });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}