import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export async function getNewThisWeek(take = 4) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  let products = await db.product.findMany({
    where: { active: true, createdAt: { gte: oneWeekAgo } },
    orderBy: { createdAt: "desc" },
    take,
  });

  // Fallback: if nothing in the last 7 days, show newest overall
  if (products.length === 0) {
    products = await db.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take,
    });
  }

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}
