import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE = "admin_session";
const FALLBACK_HASH =
  "$2b$10$oSs.DI8jU/ApXONF7DjE8.L7dW//7ejGjzRjyMcmepUGFgqr5D9Nm";

export async function verifyCredentials(username: string, password: string) {
  const envUser = process.env.ADMIN_USERNAME;
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  // bcrypt hashes are always 60 chars and start with $2b$10$
  const hash = envHash && envHash.length === 60 ? envHash : FALLBACK_HASH;

  console.log("[auth] envUser:", JSON.stringify(envUser));
  console.log(
    "[auth] envHash length:",
    envHash?.length,
    "prefix:",
    envHash?.slice(0, 7),
  );
  console.log("[auth] using hash of length:", hash.length);

  if (username !== envUser) {
    console.log("[auth] FAIL: username mismatch");
    return false;
  }

  const isMatch = await bcrypt.compare(password, hash);
  console.log("[auth] isMatch:", isMatch);
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
