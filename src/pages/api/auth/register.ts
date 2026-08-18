import type { NextApiRequest, NextApiResponse } from "next";
import { getDb, generateId } from "@/lib/db";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
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
    const db = await getDb();

    const existing = db.data.users.find((u) => u.email === data.email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const now = new Date().toISOString();
    const user = {
      id: generateId(),
      email: data.email,
      passwordHash: await hashPassword(data.password),
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      createdAt: now,
      updatedAt: now,
      isSuspended: false,
    };

    db.data.users.push(user);
    await db.write();

    const token = await createToken(user);
    res.setHeader("Set-Cookie", setAuthCookie(token));

    const { passwordHash, ...publicUser } = user;
    res.status(201).json({ user: publicUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}