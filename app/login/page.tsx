"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Idle");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1. Submit button clicked");
    setStatus("Checking...");

    try {
      console.log("2. Attempting to sign in with:", username);
      
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      console.log("3. Server responded:", result);

      if (result?.error) {
        console.error("4. Login Failed:", result.error);
        setStatus("Error: " + result.error);
        alert("Login Failed: " + result.error);
      } else {
        console.log("4. Login Success! Redirecting...");
        setStatus("Success! Redirecting...");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("CRASH:", err);
      setStatus("System Error: Check Console");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-900 text-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">Debug Login</h1>
        
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-sm font-mono border border-yellow-300 rounded">
          Status: {status}
        </div>

        <label className="block mb-2 font-bold">Username</label>
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-4 text-black"
          placeholder="admin"
        />

        <label className="block mb-2 font-bold">Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-6 text-black"
          placeholder="admin123"
        />

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold"
        >
          Login
        </button>
      </form>
    </div>
  );
}