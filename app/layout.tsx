import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers"; // Import the provider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Dashboard",
  description: "E-Commerce Admin Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-gray-100 transition-colors duration-300`}>
        <Providers>
          {/* We add a simple layout wrapper here */}
          <div className="min-h-screen flex flex-col md:flex-row">
            {/* Sidebar (Simple placeholder if you don't have a separate file) */}
            <aside className="w-full md:w-64 bg-slate-800 text-white p-6 md:min-h-screen flex-shrink-0">
               <h1 className="text-2xl font-bold mb-8">AdminPanel</h1>
               <nav className="space-y-4">
                 <a href="/" className="block py-2 hover:text-blue-400">Dashboard</a>
                 <a href="/products" className="block py-2 hover:text-blue-400">Inventory</a>
                 <a href="/add-product" className="block py-2 hover:text-blue-400">Add Product</a>
               </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
               {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}