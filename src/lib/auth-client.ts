import { createAuthClient } from "better-auth/react";

// Use the Next.js API proxy to avoid third-party cookie blocking
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const authClient = createAuthClient({
    baseURL: FRONTEND_URL,
    fetchOptions: {
        credentials: "include",
    }
});

export const { signIn, signUp, signOut, useSession } = authClient;
