import { createAuthClient } from "better-auth/react";

// Use the Next.js API proxy to avoid cross-origin cookie issues with SameSite=Lax
const BACKEND_URL = "/api";

export const authClient = createAuthClient({
    baseURL: BACKEND_URL,
    fetchOptions: {
        credentials: "include",
        auth: {
            type: "Bearer",
            token: () => {
                if (typeof window !== "undefined") {
                    return localStorage.getItem("token") || "";
                }
                return "";
            }
        }
    }
});

export const { signIn, signUp, signOut, useSession } = authClient;
