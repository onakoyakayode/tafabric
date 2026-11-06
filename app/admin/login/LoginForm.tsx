"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin/dashboard";
  const [loading, setLoading] = useState(false);
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
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h1 className="text-xl font-bold text-center">Admin Login</h1>
      {error && <p className="text-rose text-sm text-center">{error}</p>}
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
        className="w-full bg-rose text-white py-2 rounded-full disabled:opacity-50"
      >
        {loading ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
