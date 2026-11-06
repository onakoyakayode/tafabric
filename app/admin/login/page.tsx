"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const from = searchParams.get("from") ?? "/admin/dashboard";
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: fd.get("username"),
        password: fd.get("password"),
      }),
    });

    if (!res.ok) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }
    router.push(from);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ash-light px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-2xl border border-ash space-y-4"
      >
        <div className="text-center mb-2">
          <p className="font-display text-2xl">
            TA <span className="text-rose">Admin</span>
          </p>
          <p className="text-xs text-stone-500 mt-1 uppercase tracking-[0.2em]">
            Sign in
          </p>
        </div>

        {error && (
          <p className="text-rose text-sm text-center bg-rose-soft py-2 rounded-lg">
            {error}
          </p>
        )}

        <input
          name="username"
          placeholder="Username"
          required
          className="input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="input"
        />
        <button
          disabled={loading}
          className="w-full bg-rose text-white py-2.5 rounded-full text-sm font-medium hover:bg-rose-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
