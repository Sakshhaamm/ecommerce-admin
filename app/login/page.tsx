"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Show user something is happening
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid Username or Password");
      setLoading(false);
    } else {
      // FORCE a full page reload to the dashboard
      // This fixes the "stuck" issue by forcing the browser to send the new cookies
      window.location.href = "/"; 
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Admin Panel</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">{error}</div>}

        <label className="block mb-2 text-sm font-bold text-slate-700">Username</label>
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border rounded mb-4 text-slate-900 bg-gray-50 focus:outline-blue-500"
          placeholder="admin"
          disabled={loading}
        />

        <label className="block mb-2 text-sm font-bold text-slate-700">Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded mb-6 text-slate-900 bg-gray-50 focus:outline-blue-500"
          placeholder="••••••"
          disabled={loading}
        />

        <button 
          disabled={loading}
          className={`w-full text-white p-3 rounded font-bold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}