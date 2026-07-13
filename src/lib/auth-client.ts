import { createAuthClient } from "better-auth/react";

// Connect directly to the backend to ensure OAuth state cookies are set on the correct domain
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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
