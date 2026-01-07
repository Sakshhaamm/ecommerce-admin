# 🛍️ Admin Dashboard Panel

A robust, server-side rendered (SSR) Admin Dashboard built with **Next.js 14 (App Router)**. This application serves as a centralized control center for e-commerce management, allowing administrators to track sales, manage inventory, and secure access via authenticated routes.

## 🚀 Key Features

* **🔐 Secure Authentication:**
    * Powered by **NextAuth.js** (Credentials Provider).
    * Protected routes using **Middleware** to prevent unauthorized access.
    * Automatic session management and redirection.

* **📊 Analytics Dashboard:**
    * Interactive **Sales Graphs** showing monthly performance (Year-wise sorting).
    * Key metrics overview (Total Sales, Revenue, Active Stock).

* **📦 Inventory Management:**
    * **Product Listing:** View all products with image previews, prices, and stock status.
    * **Add Product:** Streamlined form to upload new inventory items directly to the database.
    * **Real-time Updates:** Changes reflect immediately across the platform.

* **📱 Modern UI/UX:**
    * Clean sidebar navigation and organized data tables.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database:** MongoDB (Mongoose)
* **Authentication:** NextAuth.js
* **Deployment:** Vercel

---

## 🔑 Admin Credentials

To access the live dashboard or local environment, use the following credentials:

* **Username:** `admin`
* **Password:** `admin123`

---

## ⚙️ Local Setup Instructions

Follow these steps to run the project on your machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sakshhaamm/ecommerce-admin
    cd ecommerce-admin
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add:
    ```env
    # Database Connection
    MONGODB_URI=your_mongodb_connection_string

    # Authentication Secrets
    NEXTAUTH_SECRET=your_super_secret_key
    NEXTAUTH_URL=http://localhost:3000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🌐 Live Deployment

The application is deployed on Vercel and can be accessed here:
[https://ecommerce-admin-56n2.vercel.app/]

---

## 📁 Project Structure

```bash
├── app/
│   ├── api/             # Backend API Routes (Auth, Products, Analytics)
│   ├── login/           # Custom Login Page
│   ├── inventory/       # Product Management Interface
│   ├── add-product/     # Product Creation Form
│   └── page.tsx         # Main Dashboard & Charts
├── components/          # Reusable UI Components (Navbar, Sidebar)
├── lib/                 # Database & Auth Utilities
├── models/              # Mongoose Database Schemas
├── middleware.ts        # Route Protection Logic
└── public/              # Static Assets