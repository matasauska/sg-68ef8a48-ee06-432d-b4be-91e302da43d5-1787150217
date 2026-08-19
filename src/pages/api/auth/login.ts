import type { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import { supabaseAdmin } from "@/integrations/supabase/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = loginSchema.parse(req.body);

    const { data: user } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", data.email)
      .single();

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.is_suspended) {
      return res.status(403).json({ message: "Account suspended" });
    }

    const valid = await verifyPassword(data.password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const publicUser = {
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
    };

    const token = await createToken(publicUser as any);
    res.setHeader("Set-Cookie", setAuthCookie(token));

    res.status(200).json({ user: publicUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}