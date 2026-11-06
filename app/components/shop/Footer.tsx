import Link from "next/link";
import { Mail, Phone } from "lucide-react";

async function getYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function Footer() {
  const year = await getYear();

  return (
    <footer className="bg-ink text-white mt-24">
      <div className="max-w-screen mx-auto px-4 lg:px-20 xl:px-25 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl mb-4">
            TA <span className="text-rose">Fabrics</span>
          </p>
          <p className="text-sm text-white/60 max-w-sm leading-relaxed">
            Handpicked Ankara, Aso-Oke and ready-to-wear pieces for weddings,
            celebrations and everyday elegance. Made in Nigeria, shipped
            worldwide.
          </p>
        </div>

        <div>
          <p className="label-xs text-white/50 mb-4">Shop</p>
          <ul className="space-y-2 text-sm">
            {[
              ["All products", "/"],
              ["Ankara", "/?category=ankara"],
              ["Aso-Oke", "/?category=aso-oke"],
              ["Bulk orders", "/?category=aso-ebi-ladies"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-white/75 hover:text-rose transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-xs text-white/50 mb-4">Contact</p>
          <ul className="space-y-2 text-sm text-white/75">
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-rose" /> hello@tafabrics.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-rose" /> +234 800 000 0000
            </li>
            <li className="flex items-center gap-2">@tafabrics</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row justify-between text-xs text-white/40">
          <p>© {year} TA Fabrics. All rights reserved.</p>
          <p>Payment via PayPal or e-Transfer · Order reference required</p>
        </div>
      </div>
    </footer>
  );
}
