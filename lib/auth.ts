import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE = "admin_session";
const FALLBACK_HASH =
  "$2b$10$G1JsYuWqVhAmvd4lotR/YO5TvvJdBFIUAcJLN4pTyedD8hyzq8ubq";

export async function verifyCredentials(username: string, password: string) {
  const envUser = process.env.ADMIN_USERNAME;
  const envHash = process.env.ADMIN_PASSWORD_HASH;

  if (!envUser || !envHash) {
    console.error("[auth] Missing admin environment variables");
    return false;
  }

  if (username.trim() !== envUser.trim()) {
    console.log("[auth] Username mismatch");
    return false;
  }

  if (!envHash.startsWith("$2") || envHash.length !== 60) {
    console.error("[auth] Invalid bcrypt hash configuration");
    return false;
  }

  const isMatch = await bcrypt.compare(password, envHash);

  console.log("[auth] Password verification:", isMatch);

  return isMatch;
}

export async function createSession(username: string) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getAdminSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { username: string };
  } catch {
    return null;
  }
}
