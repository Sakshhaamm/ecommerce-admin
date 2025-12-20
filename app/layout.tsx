import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecommerce Admin",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-slate-100">
          
          {/* SHARED SIDEBAR - Visible on every page */}
          <aside className="w-64 bg-slate-900 text-white p-5 flex flex-col">
            <h2 className="text-2xl font-bold mb-10 text-center">AdminPanel</h2>
            <nav className="flex-1">
              <ul className="space-y-4">
                <li><a href="/" className="block hover:text-blue-400 p-2">Dashboard</a></li>
                <li><a href="/products" className="block hover:text-blue-400 p-2">Products</a></li>
                <li><a href="/add-product" className="block hover:text-blue-400 p-2">Add Product</a></li>
              </ul>
            </nav>
          </aside>

          {/* MAIN CONTENT AREA - This is where 'page.tsx' content will appear */}
          <main className="flex-1 p-10 overflow-y-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}