"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function OrderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    router.push(`/admin/orders?${params.toString()}`);
  }

  function clear() {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/admin/orders?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="relative max-w-sm w-full">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search order ID or customer name"
        className="input pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-rose"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
