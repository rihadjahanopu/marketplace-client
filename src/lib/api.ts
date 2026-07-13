import {
	ApiResponse,
	Item,
	ItemFormData,
	LoginCredentials,
	PaginationData,
	RegisterCredentials,
	User,
	Review,
} from "@/types";
import axios from "axios";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? "/api" : "http://localhost:5000/api"),
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// No request interceptor needed for cookies as withCredentials is true

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			if (typeof window !== "undefined") {
				if (
					window.location.pathname !== "/login" &&
					window.location.pathname !== "/register" &&
					window.location.pathname !== "/"
				) {
					window.location.href = "/login";
				}
			}
		}
		return Promise.reject(error);
	}
);

export { api };

export const authApi = {
	register: async (data: RegisterCredentials) => {
		const response = await api.post("/auth/sign-up/email", {
			name: data.name,
			email: data.email,
			password: data.password,
			rememberMe: true,
		});
		return response.data;
	},
	login: async (data: LoginCredentials) => {
		const response = await api.post("/auth/sign-in/email", {
			email: data.email,
			password: data.password,
			rememberMe: true,
		});
		return response.data;
	},
	getMe: async (): Promise<{ success: boolean; user: User }> => {
		const response = await api.get("/me");
		return response.data;
	},
	logout: async () => {
		await api.post("/auth/sign-out");
	},
	uploadImages: async (formData: FormData): Promise<{ success: boolean; urls: string[] }> => {
		const response = await api.post("/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},
	updateProfile: async (data: { name?: string; image?: string }) => {
		const response = await api.post("/auth/update-user", data);
		return response.data;
	},
	changePassword: async (data: { currentPassword: string; newPassword: string; revokeOtherSessions?: boolean }) => {
		const response = await api.post("/auth/change-password", data);
		return response.data;
	},
};

export const itemsApi = {
	getItems: async (
		params?: Record<string, string | number | undefined | null>
	) => {
		const response = await api.get("/items", { params });
		return response.data as {
			success: boolean;
			items: Item[];
			pagination: PaginationData;
		};
	},
	getItem: async (id: string) => {
		const response = await api.get(`/items/${id}`);
		return response.data as { success: boolean; item: Item };
	},
	createItem: async (data: ItemFormData) => {
		const response = await api.post("/items", data);
		return response.data;
	},
	updateItem: async (id: string, data: Partial<ItemFormData>) => {
		const response = await api.put(`/items/${id}`, data);
		return response.data;
	},
	deleteItem: async (id: string) => {
		const response = await api.delete(`/items/${id}`);
		return response.data;
	},
	getMyItems: async () => {
		const response = await api.get("/items/my-items");
		return response.data as { success: boolean; items: Item[] };
	},
	getCategories: async () => {
		const response = await api.get("/items/categories");
		return response.data as { success: boolean; categories: string[] };
	},
	getStats: async () => {
		const response = await api.get("/items/stats");
		return response.data as { success: boolean; stats: any };
	},
	getItemReviews: async (id: string) => {
		const response = await api.get(`/items/${id}/reviews`);
		return response.data as { success: boolean; reviews: Review[] };
	},
	addReview: async (id: string, data: { rating: number; comment: string }) => {
		const response = await api.post(`/items/${id}/reviews`, data);
		return response.data as { success: boolean; review: Review; message?: string };
	},
};

export const adminApi = {
	getUsers: async (): Promise<{ success: boolean; users: User[] }> => {
		const response = await api.get("/admin/users");
		return response.data;
	},
	updateUserRole: async (id: string, role: string): Promise<ApiResponse<User>> => {
		const response = await api.put(`/admin/users/${id}/role`, { role });
		return response.data;
	},
	deleteUser: async (id: string): Promise<ApiResponse<void>> => {
		const response = await api.delete(`/admin/users/${id}`);
		return response.data;
	},
	getAllItems: async (): Promise<{ success: boolean; items: Item[] }> => {
		const response = await api.get("/admin/items");
		return response.data;
	},
	adminDeleteItem: async (id: string): Promise<ApiResponse<void>> => {
		const response = await api.delete(`/admin/items/${id}`);
		return response.data;
	},
};
