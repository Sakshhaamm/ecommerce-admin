"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid admin credentials");
      return;
    }

    // ✅ FULL reload so middleware sees cookie
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-800"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <input
          name="username"
          placeholder="Username"
          required
          className="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full mb-5 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
        />

        <button
          disabled={loading}
          className="w-full py-2 rounded bg-white text-black font-medium hover:bg-zinc-200 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
