export { default } from "next-auth/middleware";

// Define which pages to protect
// This protects home (/), products, add-product, and sales
export const config = { matcher: ["/", "/products/:path*", "/add-product", "/sales"] };