# Marketplace Client

<div align="center">
  <h3>
    <a href="https://your-live-link.com">
      🌐 View Live Demo
    </a>
  </h3>
  <p>Experience a fast, modern, and fluid user interface built with Next.js and Framer Motion.</p>
</div>

---

## 🚀 Overview
This is the frontend for the Marketplace application, built with a modern React stack. It leverages Next.js for server-side rendering and optimal performance, styled with Tailwind CSS, and uses Radix UI for accessible, high-quality components. 

The application emphasizes a **Modern UX** with smooth micro-interactions, responsive design, and instant visual feedback using optimistic UI updates and Framer Motion animations.

## 🛠️ Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, Framer Motion (for animations), Lucide React (icons)
- **Data Fetching & State:** TanStack React Query (caching & sync), Axios
- **Form Handling:** React Hook Form, Zod (schema validation)
- **Authentication:** Better Auth (supporting passkeys and OAuth)
- **Data Visualization:** Recharts

## 🌟 Key Features & Pages
- **`/explore`**: Browse and search marketplace items with advanced filtering.
- **`/items/[id]`**: Detailed view for individual products, showing images, price, and seller information.
- **`/dashboard`**: User-specific dashboard for managing their listed items and activities.
- **`/profile`**: User profile management.
- **`/admin`**: Administrative panel for managing users and platform content.
- **Auth Routes (`/login`, `/register`)**: Secure login and registration using Better Auth.

## 🏗️ Architecture & State Management
- **React Query**: Used extensively for server-state management. It handles caching, background updates, and stale data invalidation for API requests.
- **Forms**: `react-hook-form` is integrated with `zod` resolvers to provide type-safe, performant form validations before submitting to the backend.
- **UI System**: Built on top of Radix UI primitives to ensure screen-reader accessibility and keyboard navigation, customized seamlessly via Tailwind CSS.

## 📁 Folder Structure
```text
marketplace-client/
├── public/                 # Static assets (images, icons)
├── src/                    # Source code
│   ├── app/                # Next.js App Router (Pages, API routes & Layouts)
│   │   ├── about/          # About page
│   │   ├── admin/          # Admin dashboard
│   │   ├── dashboard/      # User dashboard
│   │   ├── explore/        # Search & filtering page
│   │   ├── items/          # Dynamic item details pages
│   │   ├── login/          # Login authentication flow
│   │   └── profile/        # User profile settings
│   ├── components/         # Reusable, atomic UI components (Buttons, Modals, Inputs)
│   ├── contexts/           # React Context providers (Global state)
│   ├── hooks/              # Custom React hooks (React Query wrappers, window sizing, etc.)
│   ├── lib/                # Config files & utility functions (Axios instance, Auth client)
│   ├── sections/           # Large page-specific composite components
│   └── types/              # Shared TypeScript definitions and API types
├── .env.local              # Local environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## 📦 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   **Required Variables:**
   - `NEXT_PUBLIC_API_URL`: Your backend API route (e.g., `http://localhost:5000/api`)
   - `NEXT_PUBLIC_BACKEND_URL`: Your core backend URL (e.g., `http://localhost:5000`)

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 📜 Available Scripts
- `npm run dev`: Starts the development server.
- `npm run build`: Compiles and optimizes the application for production.
- `npm run start`: Runs the production-ready build.
- `npm run lint`: Analyzes the code using ESLint.
