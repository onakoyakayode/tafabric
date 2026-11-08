export const instant = false;

import { Suspense } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import ProductList from "./ProductList";
import ProductSkeleton from "./ProductSkeleton";
import { CATEGORIES } from "@/lib/categories";
import { getNewThisWeek } from "@/lib/queries";

async function getYear() {
  "use cache";
  return new Date().getFullYear();
}

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}

async function HomeContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category ?? "";

  const year = await getYear();

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative -mx-4 lg:-mx-8 mb-16 -mt-10">
        <div
          className="relative h-[82vh] min-h-135 overflow-hidden
                  w-screen left-1/2 -translate-x-1/2"
        >
          <img
            src="/hero.jpg"
            alt="Nigerian fabric collection"
            className="absolute inset-0 w-full h-full object-cover object-center scale-[1.04]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-transparent" />
          <div className="relative h-full max-w-screen mx-auto px-6 lg:px-12 flex items-center xl:px-25">
            <div className="max-w-3xl text-white">
              <p className="label-xs text-rose mb-5 inline-flex items-center gap-2">
                <Sparkles size={12} /> New collection · {year}
              </p>
              <h1 className="text-4xl md:text-6xl leading-[1.05] mb-6">
                Woven for the moments that matter.
              </h1>
              <p className="text-base text-white/80 mb-8 leading-relaxed max-w-md">
                Authentic Ankara, Aso-Oke and bespoke pieces for weddings,
                naming ceremonies and everyday elegance. Bulk orders available.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#products" className="btn-rose">
                  Shop collection <ArrowRight size={16} className="ml-2" />
                </a>
                <Link
                  href="/?category=aso-ebi-ladies"
                  className="btn-ghost border-white/40 text-white hover:bg-white hover:text-ink"
                >
                  Bulk orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORY STRIP ============ */}
      <section className="mb-16 -mt-8">
        <div className="bg-white border border-ash rounded-2xl p-3 grid grid-cols-4 md:grid-cols-8 xl:grid-cols-6 gap-1">
          {CATEGORIES.slice(1).map((c) => (
            <Link
              key={c.slug}
              href={`/?category=${c.slug}#products`}
              className="text-center px-2 py-3 rounded-xl hover:bg-ash-light transition-colors group"
            >
              <p className="text-[11px] uppercase tracking-wider text-stone-500 group-hover:text-rose transition-colors">
                {c.label.split(" ")[0]}
              </p>
              <p className="text-xs font-medium mt-0.5 truncate">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ ON SALE / NEW IN ============ */}
      <section className="mb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="label-xs text-rose mb-2">Just arrived</p>
            <h2 className="text-3xl md:text-4xl">New this week</h2>
          </div>
          <Link
            href="/#products"
            className="text-sm text-stone-500 hover:text-rose inline-flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <Suspense fallback={<ProductSkeleton count={4} />}>
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* ============ FULL CATALOGUE ============ */}
      <section id="products" className="mb-20 scroll-mt-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="label-xs text-rose mb-2">Our collection</p>
            <h2 className="text-3xl md:text-4xl">Browse by fabric</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-10">
          {CATEGORIES.map((c) => {
            const active = activeCategory === c.slug;
            const href = c.slug ? `/?category=${c.slug}` : "/";
            return (
              <Link
                key={c.slug || "all"}
                href={href}
                scroll={false}
                className={`px-4 py-2 rounded-lg border text-sm text-center transition-colors ${
                  active
                    ? "bg-ink text-white border-ink"
                    : "border-ash hover:bg-ink hover:text-white hover:border-ink"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        <Suspense key={activeCategory} fallback={<ProductSkeleton count={8} />}>
          <ProductList category={activeCategory || undefined} />
        </Suspense>

        {activeCategory && (
          <div className="text-center mt-10">
            <Link
              href="/#products"
              className="text-sm text-stone-500 hover:text-rose transition-colors"
            >
              ← Clear filter
            </Link>
          </div>
        )}
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="mb-20 grid md:grid-cols-3 gap-4">
        {[
          {
            icon: Truck,
            title: "Worldwide shipping",
            body: "We ship to Nigeria, Canada, the UK and beyond. Tracking included.",
          },
          {
            icon: ShieldCheck,
            title: "Authentic fabrics",
            body: "Hand-selected Ankara and Aso-Oke sourced directly from weavers.",
          },
          {
            icon: PackageCheck,
            title: "Bulk-friendly",
            body: "Aso-Ebi and couple sets available for weddings and events.",
          },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="bg-white border border-ash rounded-2xl p-6 flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center shrink-0">
                <Icon size={18} className="text-rose" />
              </div>
              <div>
                <h3 className="font-medium mb-1">{f.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {f.body}
                </p>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}

async function FeaturedProducts() {
  const products = await getNewThisWeek(4);

  if (products.length === 0) return null;

  const { ProductCard } = await import("./ProductList");
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={{
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            images: p.images,
            bulkOnly: p.bulkOnly,
            minQuantity: p.minQuantity,
          }}
        />
      ))}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div>
      <div className="h-[72vh] min-h-[540px] bg-ash-light animate-pulse rounded-2xl -mx-4 lg:-mx-8" />
    </div>
  );
}
