"use client";

import { signOut } from "next-auth/react";

export default function LogoutBtn() {
    return (
        <button
            onClick={() => signOut()}
            className="block w-full text-left py-2 hover:text-red-400 text-red-300 transition-colors"
        >
            Logout
        </button>
    );
}
