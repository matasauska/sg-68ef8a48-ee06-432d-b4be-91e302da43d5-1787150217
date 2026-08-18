import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "pawmarket-local-secret-key-change-in-production"
);

function serializeCookie(name: string, value: string, options: Record<string, any>): string {
  let cookie = `${name}=${encodeURIComponent(value)}`;
  if (options.httpOnly) cookie += "; HttpOnly";
  if (options.secure) cookie += "; Secure";
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  if (options.path) cookie += `; Path=${options.path}`;
  if (options.maxAge !== undefined) cookie += `; Max-Age=${options.maxAge}`;
  return cookie;
}

function parseCookieHeader(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    cookies[name] = decodeURIComponent(rest.join("="));
  });
  return cookies;
}

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
  return serializeCookie("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(): string {
  return serializeCookie("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function parseAuthCookie(cookieHeader: string): string | undefined {
  const cookies = parseCookieHeader(cookieHeader);
  return cookies["auth-token"];
}

export function getPublicUser(user: User) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}