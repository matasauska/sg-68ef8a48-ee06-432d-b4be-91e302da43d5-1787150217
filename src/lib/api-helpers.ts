import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/integrations/supabase/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

async function getSupabaseUser(req: NextApiRequest) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const accessToken = authHeader.substring(7);

  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getCurrentUser(req: NextApiRequest) {
  const authUser = await getSupabaseUser(req);

  if (!authUser) {
    return null;
  }

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error || !profile || profile.is_suspended) {
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    fullName: profile.full_name,
    role: profile.role,
    breederVerified:
      profile.breeder_verified || profile.is_verified_breeder,
    isAdmin: profile.role === "admin",
    phone: profile.phone,
    location: profile.location,
    avatarUrl: profile.avatar_url,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

export function requireAuth(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
  ) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    return handler(req, res, user);
  };
}

export function requireRole(role: string | string[]) {
  const roles = Array.isArray(role) ? role : [role];

  return (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
      user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
    ) => Promise<void>
  ) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const user = await getCurrentUser(req);

      if (!user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: "Insufficient permissions",
        });
      }

      return handler(req, res, user);
    };
  };
}

export function requireAdmin(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
  ) => Promise<void>
) {
  return requireRole("admin")(handler);
}
