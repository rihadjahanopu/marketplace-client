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
			const { user } = await authApi.getMe();
			setUser(user);
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
		// Use authClient.signIn.email() — this sets both the session cookie (for passkey/google)
		// AND returns a token (for our custom Bearer-based API calls).
		const { data, error } = await authClient.signIn.email({
			email: credentials.email,
			password: credentials.password,
		});
		if (error) throw new Error(error.message || "Invalid email or password");

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
				image: user.image ?? null,
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
