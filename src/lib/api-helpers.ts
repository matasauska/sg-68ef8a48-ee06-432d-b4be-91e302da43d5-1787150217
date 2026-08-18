import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken, parseAuthCookie } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function getCurrentUser(req: NextApiRequest) {
  const cookieHeader = req.headers.cookie || "";
  const token = parseAuthCookie(cookieHeader);
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const db = await getDb();
  const user = db.data.users.find((u) => u.id === payload.userId);
  if (!user || user.isSuspended) return null;

  return user;
}

export function requireAuth(handler: (req: NextApiRequest, res: NextApiResponse, user: Awaited<ReturnType<typeof getCurrentUser>>) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    return handler(req, res, user);
  };
}

export function requireRole(role: string | string[]) {
  const roles = Array.isArray(role) ? role : [role];
  return (handler: (req: NextApiRequest, res: NextApiResponse, user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      return handler(req, res, user);
    };
  };
}

export function requireAdmin(handler: (req: NextApiRequest, res: NextApiResponse, user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>) => Promise<void>) {
  return requireRole("admin")(handler);
}