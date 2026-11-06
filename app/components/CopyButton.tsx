"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({
  value,
  label = "Copy",
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
        copied
          ? "bg-green-100 text-green-700"
          : "bg-ash-light text-stone-600 hover:bg-rose-soft hover:text-rose"
      } ${className}`}
      title={label}
    >
      {copied ? (
        <>
          <Check size={12} /> Copied
        </>
      ) : (
        <>
          <Copy size={12} /> {label}
        </>
      )}
    </button>
  );
}
