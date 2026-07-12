"use client";

import { authApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { LoginCredentials, RegisterCredentials, User } from "@/types";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (credentials: RegisterCredentials) => Promise<void>;
	logout: () => void;
	checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const isAuthenticated = !!user;

	const checkAuth = useCallback(async () => {
		try {
			// Primary: use better-auth's own session (works with both cookie & bearer token)
			const { data: session } = await authClient.getSession();
			if (session?.user) {
				// Also fetch /api/me to get role (better-auth session might not have it)
				try {
					const { user: meUser } = await authApi.getMe();
					setUser(meUser);
				} catch {
					// Fallback: use better-auth session user directly
					setUser({
						id: session.user.id,
						name: session.user.name,
						email: session.user.email,
						image: session.user.image ?? undefined,
						role: (session.user as any).role || "user",
						createdAt: (session.user as any).createdAt,
					});
				}
			} else {
				// No session from better-auth, try bearer token via /api/me
				try {
					const { user } = await authApi.getMe();
					setUser(user);
				} catch {
					setUser(null);
				}
			}
		} catch {
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	const login = async (credentials: LoginCredentials) => {
		// Use authClient.signIn.email() — this sets both the session cookie (for google)
		// AND returns a token (for our custom Bearer-based API calls).
		const { data, error } = await authClient.signIn.email({
			email: credentials.email,
			password: credentials.password,
		});
		if (error) {
			console.error("Login Error from authClient:", error);
			throw new Error(error.message || "Invalid email or password");
		}

		const token = data?.token;
		const user = data?.user;

		if (token) {
			localStorage.setItem("token", token);
		}
		if (user) {
			setUser({
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image ?? undefined,
				role: (user as any).role || "user",
				createdAt: (user as any).createdAt,
			});
		}
	};

	const register = async (credentials: RegisterCredentials) => {
		const data = await authApi.register(credentials);
		const token = data.token;
		const user = data.user;
		if (token) {
			localStorage.setItem("token", token);
		} else {
			console.warn("Register response missing token:", data);
		}
		if (user) {
			setUser({
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image,
				role: user.role || "user",
				createdAt: user.createdAt,
			});
		}
	};

	const logout = async () => {
		try {
			await authClient.signOut();
		} catch {
			// Ignore logout errors and still clear local UI state
		}
		localStorage.removeItem("token");
		setUser(null);
		window.location.href = "/";
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated,
				login,
				register,
				logout,
				checkAuth,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
