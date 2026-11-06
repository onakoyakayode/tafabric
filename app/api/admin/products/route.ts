import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { revalidateTag } from "next/cache";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().min(1),
  images: z.array(z.string().url()).min(1),
  bulkOnly: z.boolean().default(false),
  minQuantity: z.number().int().positive().default(1),
  active: z.boolean().default(true),
});

export async function GET() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  try {
    const product = await db.product.create({ data: parsed.data });
    revalidateTag("products", "max");
    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
