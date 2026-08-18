import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { serialize, parse } from "cookie";
import type { User } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "pawmarket-local-secret-key-change-in-production"
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(user: User): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      clockTolerance: 60,
    });
    return payload as {
      userId: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
    };
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string): string {
  return serialize("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(): string {
  return serialize("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function parseAuthCookie(cookieHeader: string): string | undefined {
  const cookies = parse(cookieHeader);
  return cookies["auth-token"];
}

export function getPublicUser(user: User) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}