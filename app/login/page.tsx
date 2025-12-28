"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // We let NextAuth handle the redirect automatically
    // This is much more reliable than doing it manually
    await signIn("credentials", {
      username: (e.target as any).username.value,
      password: (e.target as any).password.value,
      redirect: true,  // <--- ENABLE AUTO REDIRECT
      callbackUrl: "/", // <--- GO HERE AFTER LOGIN
    });
    
    // We don't need code here because the page will navigate away automatically
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Admin Panel</h1>
        
        <label className="block mb-2 text-sm font-bold text-slate-700">Username</label>
        <input 
          name="username" // Added name attribute for easier access
          type="text" 
          defaultValue=""
          className="w-full p-3 border rounded mb-4 text-slate-900 bg-gray-50 focus:outline-blue-500"
          placeholder="admin"
          required
        />

        <label className="block mb-2 text-sm font-bold text-slate-700">Password</label>
        <input 
          name="password" // Added name attribute
          type="password" 
          defaultValue=""
          className="w-full p-3 border rounded mb-6 text-slate-900 bg-gray-50 focus:outline-blue-500"
          placeholder="••••••"
          required
        />

        <button 
          type="submit" // Explicitly set type to submit
          disabled={loading}
          className={`w-full text-white p-3 rounded font-bold transition ${loading ? 'bg-gray-500 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}