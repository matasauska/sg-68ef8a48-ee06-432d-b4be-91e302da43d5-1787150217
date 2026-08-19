import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken, parseAuthCookie } from "@/lib/auth";
import { supabaseAdmin } from "@/integrations/supabase/server";

export async function getCurrentUser(req: NextApiRequest) {
  const cookieHeader = req.headers.cookie || "";
  const token = parseAuthCookie(cookieHeader);
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", payload.userId)
    .single();

  if (!profile || profile.is_suspended) return null;

  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    fullName: profile.full_name,
    role: profile.role,
    breederVerified: profile.breeder_verified || profile.is_verified_breeder,
    isAdmin: profile.role === "admin",
    phone: profile.phone,
    location: profile.location,
    avatarUrl: profile.avatar_url,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
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