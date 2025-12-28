"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Alert the user that we are starting
    alert("Step 1: Starting Login...");

    try {
      const result = await signIn("credentials", {
        username: "admin", // We hardcode these to test connectivity first
        password: "admin123",
        redirect: false,
      });

      // 2. Alert the result from the server
      alert("Step 2: Server said: " + JSON.stringify(result));

      if (result?.error) {
        alert("❌ Login Failed: " + result.error);
        setLoading(false);
      } else {
        alert("✅ Login Success! Forcing Redirect now...");
        // 3. FORCE reload to the homepage
        window.location.href = "/";
      }
    } catch (err) {
      alert("🔥 CRASH: " + err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-red-900">
      <div className="bg-white p-8 rounded w-96 text-center">
        <h1 className="text-2xl font-bold mb-4 text-black">TEST MODE</h1>
        <p className="mb-4 text-red-600 font-bold">
           (Hardcoded: admin / admin123)
        </p>
        <button 
          onClick={handleSubmit}
          className="w-full bg-red-600 text-white p-4 rounded font-bold text-xl hover:bg-red-700"
        >
          CLICK ME TO LOGIN
        </button>
      </div>
    </div>
  );
}