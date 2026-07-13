"use client";

import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/api";
import type { Item } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Loader2, Package, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ManageItemsPage() {
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
			router.push("/");
		}
	}, [authLoading, isAuthenticated, user, router]);

	const { data, isLoading } = useQuery({
		queryKey: ["admin-items"],
		queryFn: adminApi.getAllItems,
		enabled: isAuthenticated && user?.role === "admin",
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => adminApi.adminDeleteItem(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-items"] });
		},
	});

	if (authLoading || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
			</div>
		);
	}

	if (!isAuthenticated || user?.role !== "admin") return null;

	const items: Item[] = data?.items || [];

	const statusColor = (status: string) => {
		if (status === "active") return "bg-green-100 text-green-700";
		if (status === "sold") return "bg-blue-100 text-blue-700";
		return "bg-gray-100 text-gray-700";
	};

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
				{/* Header */}
				<div className="mb-6">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex flex-wrap items-center gap-3">
						Manage Items
						<span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center gap-1">
							<Shield className="w-4 h-4" />
							Admin Panel
						</span>
					</h1>
					<p className="text-gray-600 mt-2 text-sm sm:text-base">
						View and manage all items posted on the marketplace.
					</p>
				</div>

				{/* Desktop Table */}
				<div className="hidden md:block bg-white rounded-2xl card-shadow overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-gray-50 border-b border-gray-100">
									<th className="px-6 py-4 font-semibold text-gray-900 text-sm">Item</th>
									<th className="px-6 py-4 font-semibold text-gray-900 text-sm">Category</th>
									<th className="px-6 py-4 font-semibold text-gray-900 text-sm">Price</th>
									<th className="px-6 py-4 font-semibold text-gray-900 text-sm">Status</th>
									<th className="px-6 py-4 font-semibold text-gray-900 text-sm">Date</th>
									<th className="px-6 py-4 font-semibold text-gray-900 text-sm text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{items.map((item) => (
									<tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
													{item.images && item.images.length > 0 ? (
														<img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
													) : (
														<div className="w-full h-full flex items-center justify-center text-gray-400">
															<Package className="w-5 h-5" />
														</div>
													)}
												</div>
												<div>
													<p className="font-medium text-gray-900 max-w-[200px] truncate" title={item.title}>
														{item.title}
													</p>
													<p className="text-xs text-gray-500 max-w-[200px] truncate" title={item.shortDescription}>
														{item.shortDescription}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 capitalize">
												{item.category}
											</span>
										</td>
										<td className="px-6 py-4 font-medium text-gray-900">${item.price.toFixed(2)}</td>
										<td className="px-6 py-4">
											<span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(item.status)}`}>
												{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
											</span>
										</td>
										<td className="px-6 py-4 text-gray-500 text-sm">
											{new Date(item.createdAt).toLocaleDateString()}
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center justify-end gap-2">
												<Link
													href={`/items/${item._id}`}
													className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
													title="View Item">
													<ExternalLink className="w-4 h-4" />
												</Link>
												<button
													onClick={() => {
														if (window.confirm("Are you sure you want to delete this item?")) {
															deleteMutation.mutate(item._id);
														}
													}}
													disabled={deleteMutation.isPending}
													className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
													title="Delete Item">
													{deleteMutation.isPending && deleteMutation.variables === item._id ? (
														<Loader2 className="w-4 h-4 animate-spin" />
													) : (
														<Trash2 className="w-4 h-4" />
													)}
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{items.length === 0 && (
							<div className="p-8 text-center text-gray-500">No items found.</div>
						)}
					</div>
				</div>

				{/* Mobile Cards */}
				<div className="md:hidden space-y-3">
					{items.length === 0 && (
						<div className="bg-white rounded-2xl card-shadow p-8 text-center text-gray-500">
							No items found.
						</div>
					)}
					{items.map((item) => (
						<motion.div
							key={item._id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-white rounded-2xl card-shadow p-4">
							<div className="flex items-start gap-3">
								{/* Thumbnail */}
								<div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
									{item.images && item.images.length > 0 ? (
										<img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<Package className="w-6 h-6" />
										</div>
									)}
								</div>
								{/* Info */}
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-gray-900 truncate">{item.title}</p>
									<p className="text-sm text-gray-500 truncate">{item.shortDescription}</p>
									<div className="mt-2 flex flex-wrap items-center gap-2">
										<span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 capitalize">
											{item.category}
										</span>
										<span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(item.status)}`}>
											{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
										</span>
										<span className="text-xs font-bold text-gray-800">${item.price.toFixed(2)}</span>
									</div>
									<p className="text-xs text-gray-400 mt-1">
										{new Date(item.createdAt).toLocaleDateString()}
									</p>
								</div>
								{/* Actions */}
								<div className="flex flex-col gap-1 flex-shrink-0">
									<Link
										href={`/items/${item._id}`}
										className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
										title="View Item">
										<ExternalLink className="w-4 h-4" />
									</Link>
									<button
										onClick={() => {
											if (window.confirm("Are you sure you want to delete this item?")) {
												deleteMutation.mutate(item._id);
											}
										}}
										disabled={deleteMutation.isPending}
										className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
										title="Delete Item">
										{deleteMutation.isPending && deleteMutation.variables === item._id ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Trash2 className="w-4 h-4" />
										)}
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
}
