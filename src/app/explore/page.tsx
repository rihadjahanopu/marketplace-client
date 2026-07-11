"use client";

import { ItemCard } from "@/components/ItemCard";
import { ItemCardSkeleton } from "@/components/ItemCardSkeleton";
import { itemsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
	ChevronLeft,
	ChevronRight,
	Grid3X3,
	LayoutList,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const sortOptions = [
	{ value: "createdAt:desc", label: "Newest First" },
	{ value: "createdAt:asc", label: "Oldest First" },
	{ value: "price:asc", label: "Price: Low to High" },
	{ value: "price:desc", label: "Price: High to Low" },
	{ value: "rating:desc", label: "Highest Rated" },
	{ value: "title:asc", label: "Name A-Z" },
];

function ExplorePageContent() {
	const searchParams = useSearchParams();
	const initialCategory = searchParams.get("category") || "";

	const [search, setSearch] = useState("");
	const [category, setCategory] = useState(initialCategory);
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [location, setLocation] = useState("");
	const [sortBy, setSortBy] = useState("createdAt:desc");
	const [page, setPage] = useState(1);
	const [showFilters, setShowFilters] = useState(false);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	const { data: categoriesData } = useQuery({
		queryKey: ["categories"],
		queryFn: itemsApi.getCategories,
	});

	const { data, isLoading, refetch } = useQuery({
		queryKey: [
			"items",
			search,
			category,
			minPrice,
			maxPrice,
			location,
			sortBy,
			page,
		],
		queryFn: () =>
			itemsApi.getItems({
				...(search && { search }),
				...(category && { category }),
				...(minPrice && { minPrice }),
				...(maxPrice && { maxPrice }),
				...(location && { location }),
				sortBy: sortBy.split(":")[0],
				order: sortBy.split(":")[1],
				page,
				limit: 12,
			}),
	});

	useEffect(() => {
		setPage(1);
	}, [search, category, minPrice, maxPrice, location, sortBy]);

	const items = data?.items || [];
	const pagination = data?.pagination;

	return (
		<div className="pt-24 pb-16 min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Explore Items
					</h1>
					<p className="text-gray-600">
						Discover amazing items from sellers around the world
					</p>
				</motion.div>

				{/* Search & Controls */}
				<div className="bg-white rounded-2xl p-4 mb-6 card-shadow">
					<div className="flex flex-col lg:flex-row gap-3">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search items..."
								className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							/>
						</div>
						<div className="flex gap-2">
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
								{sortOptions.map((o) => (
									<option
										key={o.value}
										value={o.value}>
										{o.label}
									</option>
								))}
							</select>
							<button
								onClick={() => setShowFilters(!showFilters)}
								className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
									showFilters ?
										"border-primary-500 text-primary-600 bg-primary-50"
									:	"border-gray-200 text-gray-700 hover:bg-gray-50"
								}`}>
								<SlidersHorizontal className="w-4 h-4" />
								Filters
							</button>
							<div className="flex border border-gray-200 rounded-xl overflow-hidden">
								<button
									onClick={() => setViewMode("grid")}
									className={`p-2.5 ${viewMode === "grid" ? "bg-primary-50 text-primary-600" : "text-gray-400 hover:text-gray-600"}`}>
									<Grid3X3 className="w-4 h-4" />
								</button>
								<button
									onClick={() => setViewMode("list")}
									className={`p-2.5 ${viewMode === "list" ? "bg-primary-50 text-primary-600" : "text-gray-400 hover:text-gray-600"}`}>
									<LayoutList className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>

					{/* Filters */}
					{showFilters && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
							<select
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
								<option value="">All Categories</option>
								{categoriesData?.categories?.map((cat) => (
									<option
										key={cat}
										value={cat}>
										{cat}
									</option>
								))}
							</select>
							<input
								type="number"
								value={minPrice}
								onChange={(e) => setMinPrice(e.target.value)}
								placeholder="Min Price"
								className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
							/>
							<input
								type="number"
								value={maxPrice}
								onChange={(e) => setMaxPrice(e.target.value)}
								placeholder="Max Price"
								className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
							/>
							<input
								type="text"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder="Location"
								className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
							/>
						</motion.div>
					)}
				</div>

				{/* Results count */}
				<div className="mb-4 flex items-center justify-between">
					<p className="text-sm text-gray-600">
						{pagination?.total ?
							`${pagination.total} items found`
						:	"Loading..."}
					</p>
					{(category || minPrice || maxPrice || location || search) && (
						<button
							onClick={() => {
								setSearch("");
								setCategory("");
								setMinPrice("");
								setMaxPrice("");
								setLocation("");
							}}
							className="text-sm text-primary-600 hover:text-primary-700 font-medium">
							Clear all filters
						</button>
					)}
				</div>

				{/* Items Grid */}
				{isLoading ?
					<div
						className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
						{Array.from({ length: 12 }).map((_, i) => (
							<ItemCardSkeleton key={i} />
						))}
					</div>
				: items.length === 0 ?
					<div className="text-center py-16 bg-white rounded-2xl">
						<Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							No items found
						</h3>
						<p className="text-gray-600">
							Try adjusting your search or filters
						</p>
					</div>
				:	<div
						className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
						{items.map((item, i) => (
							<motion.div
								key={item._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.05 }}>
								<ItemCard
									item={item}
									viewMode={viewMode}
								/>
							</motion.div>
						))}
					</div>
				}

				{/* Pagination */}
				{pagination && pagination.pages > 1 && (
					<div className="mt-8 flex items-center justify-center gap-2">
						<button
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
							className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
							<ChevronLeft className="w-5 h-5" />
						</button>
						{Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
							(p) => (
								<button
									key={p}
									onClick={() => setPage(p)}
									className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
										page === p ?
											"bg-primary-600 text-white"
										:	"border border-gray-200 hover:bg-gray-50"
									}`}>
									{p}
								</button>
							)
						)}
						<button
							onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
							disabled={page === pagination.pages}
							className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default function ExplorePage() {
	return (
		<Suspense
			fallback={<div className="pt-24 pb-16 min-h-screen bg-gray-50" />}>
			<ExplorePageContent />
		</Suspense>
	);
}
