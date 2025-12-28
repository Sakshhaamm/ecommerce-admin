import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // HARDCODED ADMIN FOR NOW
        if (
          credentials?.username === "admin" && 
          credentials?.password === "admin123" 
        ) {
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // Redirect here if not logged in
    error: '/login',  // <--- ADD THIS LINE (Redirect errors back to login instead of 404)
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this reads the environment variable
});

export { handler as GET, handler as POST };