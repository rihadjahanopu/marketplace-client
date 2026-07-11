import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";

// better-auth client MUST use the real backend URL (not /api proxy)
// because OAuth (Google) and Passkey flows redirect through the actual backend domain
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const authClient = createAuthClient({
    baseURL: BACKEND_URL,
    plugins: [passkeyClient()],
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
