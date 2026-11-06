"use client";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";

const LINKS = [
  { href: "/", label: "Shop All" },
  { href: "/category/ankara-gown", label: "Ankara" },
  { href: "/category/aso-oke-trouser", label: "Aso-Oke" },
  { href: "/category/joggers", label: "Joggers" },
  { href: "/category/aso-ebi-ladies", label: "Bulk / Aso-Ebi" },
];

export default function Navbar() {
  const { items } = useCart();
  const count = items.length;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Announcement bar — black with rose accent */}
      <div className="bg-ink text-white text-center text-[11px] tracking-[0.18em] uppercase py-2.5">
        Free delivery on bulk orders above CAD150
        <span className="text-rose mx-2">·</span>
        Worldwide shipping
      </div>

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ash">
        <div className="max-w-screen mx-auto flex items-center justify-between px-4 lg:px-20 xl:px-25 h-16">
          <Link href="/" className="font-display text-2xl tracking-tight">
            <Image src="/logo.png" alt="TA Fabrics" width={50} height={40} />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="relative py-1 hover:text-rose transition-colors
                           after:absolute after:left-0 after:-bottom-0.5 after:h-px
                           after:w-0 after:bg-rose after:transition-all
                           hover:after:w-full"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 hover:text-rose transition-colors"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 bg-rose text-white text-[10px]
                             w-5 h-5 rounded-full flex items-center justify-center font-medium"
                >
                  {count}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-ash bg-white px-4 py-4 flex flex-col gap-4 text-sm">
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
