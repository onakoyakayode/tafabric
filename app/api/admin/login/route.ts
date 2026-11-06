import { NextResponse } from "next/server";
import { createSession, verifyCredentials } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ username: z.string(), password: z.string() });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const ok = await verifyCredentials(
    parsed.data.username,
    parsed.data.password,
  );
  if (!ok)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  await createSession(parsed.data.username);
  return NextResponse.json({ success: true });
}
