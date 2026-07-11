"use client";

import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/api";
import type { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Shield, Trash2, UserCog, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ManageUsersPage() {
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
			router.push("/");
		}
	}, [authLoading, isAuthenticated, user, router]);

	const { data, isLoading } = useQuery({
		queryKey: ["admin-users"],
		queryFn: adminApi.getUsers,
		enabled: isAuthenticated && user?.role === "admin",
	});

	const roleMutation = useMutation({
		mutationFn: ({ id, role }: { id: string; role: string }) =>
			adminApi.updateUserRole(id, role),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => adminApi.deleteUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
		},
	});

	if (authLoading || isLoading) {
		return (
			<div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
			</div>
		);
	}

	if (!isAuthenticated || user?.role !== "admin") return null;

	const users: User[] = data?.users || [];

	return (
		<div className="pt-24 pb-16 min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}>
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
							Manage Users
							<span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center gap-1">
								<Shield className="w-4 h-4" />
								Admin Panel
							</span>
						</h1>
						<p className="text-gray-600 mt-2">
							View and manage all registered users on the platform.
						</p>
					</div>

					<div className="bg-white rounded-2xl card-shadow overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="bg-gray-50 border-b border-gray-100">
										<th className="px-6 py-4 font-semibold text-gray-900 text-sm">User</th>
										<th className="px-6 py-4 font-semibold text-gray-900 text-sm">Email</th>
										<th className="px-6 py-4 font-semibold text-gray-900 text-sm">Role</th>
										<th className="px-6 py-4 font-semibold text-gray-900 text-sm">Joined</th>
										<th className="px-6 py-4 font-semibold text-gray-900 text-sm text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{users.map((u) => (
										<tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
														{u.name.charAt(0).toUpperCase()}
													</div>
													<span className="font-medium text-gray-900">{u.name}</span>
												</div>
											</td>
											<td className="px-6 py-4 text-gray-600 text-sm">{u.email}</td>
											<td className="px-6 py-4">
												<span
													className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max ${
														u.role === "admin"
															? "bg-red-100 text-red-700"
															: "bg-blue-100 text-blue-700"
													}`}>
													{u.role === "admin" ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
													{u.role}
												</span>
											</td>
											<td className="px-6 py-4 text-gray-500 text-sm">
												{new Date(u.createdAt).toLocaleDateString()}
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center justify-end gap-2">
													{u.id !== user.id && (
														<>
															<button
																onClick={() =>
																	roleMutation.mutate({
																		id: u.id,
																		role: u.role === "admin" ? "user" : "admin",
																	})
																}
																disabled={roleMutation.isPending}
																className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
																title={u.role === "admin" ? "Demote to User" : "Promote to Admin"}>
																{roleMutation.isPending && roleMutation.variables?.id === u.id ? (
																	<Loader2 className="w-4 h-4 animate-spin" />
																) : (
																	<UserCog className="w-4 h-4" />
																)}
															</button>
															<button
																onClick={() => {
																	if (window.confirm("Are you sure you want to delete this user?")) {
																		deleteMutation.mutate(u.id);
																	}
																}}
																disabled={deleteMutation.isPending}
																className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
																title="Delete User">
																{deleteMutation.isPending && deleteMutation.variables === u.id ? (
																	<Loader2 className="w-4 h-4 animate-spin" />
																) : (
																	<Trash2 className="w-4 h-4" />
																)}
															</button>
														</>
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{users.length === 0 && (
								<div className="p-8 text-center text-gray-500">
									No users found.
								</div>
							)}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
