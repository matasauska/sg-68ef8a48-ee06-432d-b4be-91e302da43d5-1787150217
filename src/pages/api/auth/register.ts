import type { NextApiRequest, NextApiResponse } from "next";
import { generateId } from "@/lib/db";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { supabaseAdmin } from "@/integrations/supabase/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["buyer", "breeder"]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = registerSchema.parse(req.body);

    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", data.email)
      .single();

    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const now = new Date().toISOString();
    const userId = generateId();
    const passwordHash = await hashPassword(data.password);

    await supabaseAdmin.from("profiles").insert({
      id: userId,
      email: data.email,
      password_hash: passwordHash,
      first_name: data.firstName,
      last_name: data.lastName,
      full_name: `${data.firstName} ${data.lastName}`,
      role: data.role,
      breeder_verified: false,
      is_verified_breeder: false,
      is_suspended: false,
      created_at: now,
      updated_at: now,
    });

    const user = {
      id: userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      role: data.role,
      breederVerified: false,
      isAdmin: false,
      isSuspended: false,
      createdAt: now,
      updatedAt: now,
    };

    const token = await createToken(user as any);
    res.setHeader("Set-Cookie", setAuthCookie(token));

    res.status(201).json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}