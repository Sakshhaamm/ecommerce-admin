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
        // HARDCODED ADMIN USER
        // You can change "admin" and "admin123" to whatever you want
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
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };