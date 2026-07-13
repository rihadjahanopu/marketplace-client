"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "@/lib/api";
import { Item } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	List,
	Trash2,
	ExternalLink,
	Loader2,
	AlertCircle,
	X,
	Package,
	MapPin,
	Tag,
	Pencil,
} from "lucide-react";

export default function ManageItemsPage() {
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [deleteModal, setDeleteModal] = useState<string | null>(null);

	const { data, isLoading } = useQuery({
		queryKey: ["my-items"],
		queryFn: itemsApi.getMyItems,
		enabled: isAuthenticated,
	});

	const deleteMutation = useMutation({
		mutationFn: itemsApi.deleteItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["my-items"] });
			setDeleteModal(null);
		},
	});

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [authLoading, isAuthenticated, router]);

	if (authLoading) {
		return (
			<div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
			</div>
		);
	}

	if (!isAuthenticated) return null;

	const items = data?.items || [];

	return (
		<div className="pt-24 pb-16 min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Manage Items</h1>
							<p className="text-gray-600 mt-1">
								View and manage your listings
							</p>
						</div>
						<Link
							href="/items/add"
							className="px-4 py-2.5 bg-linear-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity text-sm flex items-center gap-2">
							<Package className="w-4 h-4" />
							Add Item
						</Link>
					</div>

					{isLoading ?
						<div className="flex items-center justify-center py-16">
							<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
						</div>
					: items.length === 0 ?
						<div className="bg-white rounded-2xl p-12 text-center card-shadow">
							<Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								No items yet
							</h3>
							<p className="text-gray-600 mb-4">
								Start selling by creating your first listing
							</p>
							<Link
								href="/items/add"
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium">
								Create Listing
							</Link>
						</div>
					: <>
						{/* Desktop Table */}
						<div className="hidden md:block bg-white rounded-2xl overflow-hidden card-shadow">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50 border-b border-gray-100">
										<tr>
											<th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Item</th>
											<th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
											<th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
											<th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
											<th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
											<th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{items.map((item: Item, i: number) => (
											<motion.tr
												key={item._id}
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: i * 0.05 }}
												className="hover:bg-gray-50 transition-colors">
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
															<Image
																src={item.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop"}
																alt={item.title}
																fill
																className="object-cover"
															/>
														</div>
														<div>
															<p className="font-medium text-gray-900 text-sm line-clamp-1">{item.title}</p>
															<p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
																<MapPin className="w-3 h-3" />
																{item.location}
															</p>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
														<Tag className="w-3 h-3" />
														{item.category}
													</span>
												</td>
												<td className="px-6 py-4">
													<p className="font-semibold text-gray-900 text-sm">{formatPrice(item.price)}</p>
												</td>
												<td className="px-6 py-4">
													<span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
														item.status === "active" ? "bg-green-100 text-green-700"
														: item.status === "sold" ? "bg-gray-100 text-gray-700"
														: "bg-yellow-100 text-yellow-700"
													}`}>
														{item.status}
													</span>
												</td>
												<td className="px-6 py-4 text-sm text-gray-600">{formatDate(item.createdAt)}</td>
												<td className="px-6 py-4">
													<div className="flex items-center justify-end gap-2">
														<Link href={`/items/${item._id}`} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View Item">
															<ExternalLink className="w-4 h-4" />
														</Link>
														<Link href={`/items/edit/${item._id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Item">
															<Pencil className="w-4 h-4" />
														</Link>
														<button onClick={() => setDeleteModal(item._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Item">
															<Trash2 className="w-4 h-4" />
														</button>
													</div>
												</td>
											</motion.tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Mobile Cards */}
						<div className="md:hidden space-y-3">
							{items.map((item: Item, i: number) => (
								<motion.div
									key={item._id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.05 }}
									className="bg-white rounded-2xl card-shadow p-4">
									<div className="flex items-start gap-3">
										{/* Thumbnail */}
										<div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
											<Image
												src={item.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop"}
												alt={item.title}
												fill
												className="object-cover"
											/>
										</div>
										{/* Info */}
										<div className="flex-1 min-w-0">
											<p className="font-semibold text-gray-900 truncate">{item.title}</p>
											<p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
												<MapPin className="w-3 h-3" /> {item.location}
											</p>
											<div className="mt-2 flex flex-wrap items-center gap-2">
												<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
													<Tag className="w-3 h-3" />{item.category}
												</span>
												<span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-medium ${
													item.status === "active" ? "bg-green-100 text-green-700"
													: item.status === "sold" ? "bg-gray-100 text-gray-700"
													: "bg-yellow-100 text-yellow-700"
												}`}>
													{item.status}
												</span>
												<span className="text-xs font-bold text-gray-800">{formatPrice(item.price)}</span>
											</div>
											<p className="text-xs text-gray-400 mt-1">{formatDate(item.createdAt)}</p>
										</div>
										{/* Actions */}
										<div className="flex flex-col gap-1 shrink-0">
											<Link href={`/items/${item._id}`} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View">
												<ExternalLink className="w-4 h-4" />
											</Link>
											<Link href={`/items/edit/${item._id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
												<Pencil className="w-4 h-4" />
											</Link>
											<button onClick={() => setDeleteModal(item._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</>}
				</motion.div>
			</div>

			{/* Delete Modal */}
			<AnimatePresence>
				{deleteModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
						onClick={() => setDeleteModal(null)}>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							onClick={(e) => e.stopPropagation()}
							className="bg-white rounded-2xl p-6 max-w-sm w-full card-shadow">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									Delete Item
								</h3>
								<button
									onClick={() => setDeleteModal(null)}
									className="text-gray-400 hover:text-gray-600">
									<X className="w-5 h-5" />
								</button>
							</div>
							<div className="flex items-start gap-3 mb-4">
								<AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
								<p className="text-sm text-gray-600">
									Are you sure you want to delete this item? This action cannot
									be undone.
								</p>
							</div>
							<div className="flex gap-3">
								<button
									onClick={() => setDeleteModal(null)}
									className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
									Cancel
								</button>
								<button
									onClick={() => deleteMutation.mutate(deleteModal)}
									disabled={deleteMutation.isPending}
									className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70">
									{deleteMutation.isPending ?
										<Loader2 className="w-4 h-4 animate-spin" />
									:	<Trash2 className="w-4 h-4" />}
									Delete
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
