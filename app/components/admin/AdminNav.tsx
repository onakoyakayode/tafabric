"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, ShoppingBag, Package, Menu, X } from "lucide-react";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
];

export default function AdminNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {LINKS.map((l) => {
        const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => mobile && setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? "bg-rose text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={18} />
            <span>{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  if (!mobile) return <div className="flex-1">{items}</div>;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg hover:bg-white/10"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 bg-ink text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="font-display text-lg">
                TA <span className="text-rose">Admin</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {items}

            <div className="px-4 py-4 border-t border-white/10 space-y-3">
              <Link
                href="/"
                target="_blank"
                className="block text-xs text-white/60 hover:text-rose"
              >
                View shop ↗
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
