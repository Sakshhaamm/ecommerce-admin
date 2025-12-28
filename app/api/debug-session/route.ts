import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    return NextResponse.json({
        session,
        cookies: allCookies,
        envSecret: process.env.NEXTAUTH_SECRET ? "Exists" : "Missing",
    });
}
