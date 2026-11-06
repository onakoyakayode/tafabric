import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/app/components/admin/LogoutButton";
import AdminNav from "../components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ash-light">
      {/* Mobile header — only visible < lg */}
      <header className="lg:hidden bg-ink text-white sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin/dashboard" className="flex items-center">
            <Image src="/logo.png" alt="TA Fabrics" width={40} height={32} />
          </Link>
          <AdminNav mobile />
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-ink text-white flex-col z-30">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="TA Fabrics" width={40} height={32} />
            <span className="font-display text-lg text-white">Admin</span>
          </Link>
        </div>

        <AdminNav />

        <div className="mt-auto px-4 py-4 border-t border-white/10">
          <Link
            href="/"
            target="_blank"
            className="block text-xs text-white/60 hover:text-rose transition-colors mb-3"
          >
            View shop ↗
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content — offset for sidebar on desktop */}
      <main className="lg:pl-64">
        <div className="max-w-screen mx-auto px-4 lg:px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
