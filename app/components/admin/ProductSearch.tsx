"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    router.push(`/admin/products?${params.toString()}`);
  }

  function clear() {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/admin/products?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="relative max-w-md w-full">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name, slug or category…"
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-ash rounded-full text-sm
                   focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/15"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                     text-stone-400 hover:text-rose hover:bg-rose-soft transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
