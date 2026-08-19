import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken, parseAuthCookie } from "@/lib/auth";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const cookieHeader = req.headers.cookie || "";
  const token = parseAuthCookie(cookieHeader);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { data: user } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", payload.userId)
    .single();

  if (!user || user.is_suspended) {
    return res.status(401).json({ message: "Account not found or suspended" });
  }

  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      fullName: user.full_name,
      role: user.role,
      breederVerified: user.breeder_verified || user.is_verified_breeder,
      isAdmin: user.role === "admin",
      isSuspended: user.is_suspended,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
  });
}