import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
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
    const db = await getDb();

    const user = db.data.users.find((u) => u.email === data.email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: "Account suspended" });
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await createToken(user);
    res.setHeader("Set-Cookie", setAuthCookie(token));

    const { passwordHash, ...publicUser } = user;
    res.status(200).json({ user: publicUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}